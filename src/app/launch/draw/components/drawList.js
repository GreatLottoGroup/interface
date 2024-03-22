'use client';

import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import Card from '@/launch/components/card'

import { DrawGroupBalls } from '@/launch/hooks/balls'
import { BlockPeriods, C, formatAmount, shortAddress } from '@/launch/hooks/globalVars'
import { useDrawNumbers } from '@/launch/hooks/drawNumbers'
import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import useGreatLottoNft from '@/launch/hooks/contracts/GreatLottoNft'

const listSize = 10
const maxSearch = 100

export default function DrawList({currentBlock}) {

    const config = useConfig();

    const [drawList, setDrawList] = useState([])
    const [searchRange, setSearchRange] = useState([0, 0])
    const [drawDetailShow, setDrawDetailShow] = useState({})
    const blockSearchEl = useRef(null)

    const { getDrawNumber } = useDrawNumbers()
    const { getBlockBalance, getBlockDrawStatus } = usePrizePool()
    const { getTicketsByTargetNumber } = useGreatLottoNft()
    const { checkBlockBonus } = useGreatLotto()

    const getDrawList = async (blockNumber, direction) => {
        direction = direction || 0;
        let curBlockNumber = await getBlockNumber(config);
        console.log('getDrawList')
        console.log(curBlockNumber)
        let maxNumber = curBlockNumber - BlockPeriods;

        if(blockNumber){
            blockNumber = BigInt(blockNumber)
            if(blockNumber > maxNumber){
                blockNumber = maxNumber
            }
        }else{
            blockNumber = maxNumber
        }

        let list = [];
        let bn = blockNumber;

        while(list.length < listSize && Math.abs(Number(blockNumber - bn)) < maxSearch && bn <= maxNumber){
            console.log('bn: ', bn)
            let blockPrize = await getBlockBalance(bn)
            console.log('blockPrize: ', blockPrize)
            if(blockPrize > 0n){
                let tickets = await getTicketsByTargetNumber(bn)
                let drawNumber = await getDrawNumber(bn)
                let status = await getBlockDrawStatus(bn)
                if(!status.isDraw && bn > curBlockNumber - 256n){
                    let checkInfo = await checkBlockBonus(bn);
                    status.normalAwardSumAmount = checkInfo[1];
                    status.topBonusMultiples = checkInfo[2];
                }
                list.push({
                    blockNumber: bn,
                    drawNumber,
                    tickets,
                    blockPrize,
                    status
                })
            }
            if(direction > 0){
                bn ++;
            }else{
                bn --;
            }
        }

        let range = [bn + 1n, blockNumber];

        if(direction > 0){
            list.reverse();
            range[0] = range[0] - 2n
            range.reverse()
        }

        console.log(list)
        setDrawList(list);

        console.log(range)
        setSearchRange(range);


    }

    const toggleDetailShow = (blockNumber, isShow) => {
        blockNumber = blockNumber.toString()
        let newData = {...drawDetailShow};
        newData[blockNumber] = isShow;
        setDrawDetailShow(newData);
    }

    useEffect(()=>{

        console.log('useEffect~')

        getDrawList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBlock])

    return (
    <>
        <Card title="Draw Block List" reload={getDrawList}>
            <div className='row my-3'>
                <div className='col-4'>
                    <div className="input-group input-group-sm">
                        <input type="number" className="form-control" placeholder="Block Number..." ref={blockSearchEl}/>
                        <button className="btn btn-outline-secondary" type="button" onClick={()=>{
                            let blockNumber = blockSearchEl.current.value
                            if(blockNumber > maxSearch){
                                getDrawList(blockNumber)
                                blockSearchEl.current.value = ''
                            }
                        }}> Search Block </button>
                    </div>
                </div>
                <div className='col text-end'>
                    <span className='text-muted align-middle'>{searchRange[0].toString()} ~ {searchRange[1].toString()} </span>
                    <div className="input-group input-group-sm ms-3 d-inline">
                        <button className="btn btn-outline-secondary" type="button" onClick={()=>{
                            getDrawList(searchRange[0] - 1n)
                        }}> &laquo; Previous </button>
                        <button className="btn btn-outline-secondary" type="button" disabled={currentBlock?.number && searchRange[1] >= currentBlock.number - BlockPeriods} onClick={()=>{
                            getDrawList(searchRange[1] + 1n, 1)
                        }}> Next &raquo; </button>
                    </div>
                </div>
            </div>
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Block Number</th>
                        <th>Block Prize</th>
                        <th>Tickets Count</th>
                        <th>Draw Number</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                {drawList.map((item, i) => 
                    <tr key={i}>
                        <td>{item.blockNumber.toString()}</td>
                        <td>{formatAmount(item.blockPrize)}</td>
                        <td>{item.tickets.length}</td>
                        <td><DrawGroupBalls drawNumbers={item.drawNumber} /></td>
                        <td>{item.status.isDraw ? 'Drawn' : 'Not Drawn'}</td>
                        <td><a className="bi bi-card-list link-secondary link-primary-hover cursor-pointer fs-5" onClick={()=>{
                            toggleDetailShow(item.blockNumber, true)
                        }}></a>
                            <Modal show={drawDetailShow[item.blockNumber.toString()]} centered onHide={()=>{toggleDetailShow(item.blockNumber, false)}}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Block Number: {item.blockNumber.toString()}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {item.status.isDraw ? (
                                    <>
                                        <p className='mb-1'>Normal Award Sum Amount: {formatAmount(item.status.normalAwardSumAmount)} GLC</p>
                                        <p className='mb-1'>Top Bonus Count: {item.status.topBonusMultiples || 0}</p>
                                        <p className='mb-1'>Top Bonus Sum Amount: {formatAmount(item.status.topBonusSumAmount)} GLC</p>
                                        <p className='mb-1'>Benefit Rate: {Number(item.status.benefitRate)/10}%</p>
                                        <p className='mb-1'>Benefit Amount: {formatAmount(item.status.benefitAmount)} GLC</p>
                                        <p className='mb-1'>Opener: {shortAddress(item.status.opener)}</p>
                                    </>
                                    ) : (
                                    <>
                                        <p className='mb-1'>Normal Award Sum Amount: {item.status.normalAwardSumAmount.toString()} GLC</p>
                                        <p className='mb-1'>Top Bonus Count: {item.status.topBonusMultiples || 0}</p>
                                    </>
                                    )}
                                </Modal.Body>
                            </Modal>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

        </Card>

    </>

    )
}

