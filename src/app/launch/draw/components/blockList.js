'use client';

import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import Card from '@/launch/components/card'
import List from '@/launch/components/list'

import { DrawGroupBalls } from '@/launch/hooks/balls'
import { BlockPeriods, shortAddress, IssueInterval } from '@/launch/hooks/globalVars'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import useGreatLottoNft from '@/launch/hooks/contracts/GreatLottoNft'
import { usePageNav, PageNav } from '@/launch/hooks/pageNav'
import {useTargetBlock} from '@/launch/hooks/targetBlock'
import { useDrawNumbers, drawTicketList } from '@/launch/hooks/drawNumbers'
import { glc, gleth, amount } from "@/launch/components/coinShow"

export default function BlockList({currentBlock}) {

    const config = useConfig();

    const [showList, setShowList] = useState([])
    const [showListBase, setShowListBase] = useState([])
    const {getBlockListWithStatus, listStatus, allList} = useTargetBlock()

    const [isLoading, setIsLoading] = useState(false);

    const [drawDetailShow, setDrawDetailShow] = useState({})

    const blockSearchEl = useRef(null)
    const statusSearchEl = useRef(null)

    const { getDrawNumber } = useDrawNumbers()
    const { getBlockBalance } = usePrizePool()
    const { getTicketsByTargetNumber, getNftTicket } = useGreatLottoNft()

    const { getPageNavInfo, pageCurrent, pageCount, setPageCurrent } = usePageNav()

    const showListByPage = async (base) => {

        let _list = [];
        let _showListBase = base || showListBase
        let curBlockNumber = await getBlockNumber(config);

        let [_pageCount, startIndex, endIndex] = getPageNavInfo(_showListBase.length);

        console.log('showListBase: ', _showListBase);
        console.log('page: ', pageCurrent);
        console.log('startIndex: ', startIndex);
        console.log('endIndex: ', endIndex);
        console.log('pageCount: ', _pageCount);

        for(let i = startIndex; i < endIndex; i++){
            let info = await _showBlock(_showListBase[i], curBlockNumber);
            _list.push(info);
        }

        setShowList(_list);

    }

    const _showBlock = async  (info, curBlockNumber) => {
        let maxNumber = curBlockNumber - BlockPeriods;
        // blockBalance
        info.blockPrize = await getBlockBalance(info.blockNumber, false)
        info.blockEthPrize = await getBlockBalance(info.blockNumber, true)
        // tickets          
        info.tickets = await getTicketsByTargetNumber(info.blockNumber)
        // drawNumber
        if(info.status != 'drawnList' && info.blockNumber <= maxNumber){
            info.drawNumber = await getDrawNumber(info.blockNumber);
            let numberList = [];
            for (let ti = 0; ti < info.tickets.length; ti++) {
                let ticket = await getNftTicket(info.tickets[ti]);
                numberList = [...numberList, ...ticket.numbers]
            }
            [info.normalAwardSumAmount, info.topBonusMultiples] = drawTicketList(numberList, info.drawNumber, false);
            [info.normalAwardSumAmountByEth, info.topBonusMultiplesByEth] = drawTicketList(numberList, info.drawNumber, true);
        }

        return info;

    }

    const searchBlock = async (blockNumber) => {
        blockNumber = BigInt(blockNumber)
        let block1 = blockNumber / IssueInterval * IssueInterval
        let block2 = 0n;
        if(block1 != blockNumber){
            block2 = (blockNumber / IssueInterval + 1n) * IssueInterval
        }
        let result = []
        let curBlockNumber = await getBlockNumber(config);
        for (let i = 0; i < allList.length; i++) {
            if(block2 == 0n){
                if(allList[i].blockNumber == blockNumber){
                    result.push(allList[i]);
                    break;
                }
            }else{
                if(allList[i].blockNumber == block1 || allList[i].blockNumber == block2){
                    result.push(allList[i]);
                }
            }
        }

        for (let i = 0; i < result.length; i++) {
            result[i] = await _showBlock(result[i], curBlockNumber);;
        }

        setShowList(result);
        getPageNavInfo(1);
    }
    
    const showListByStatus = async (list) => {
        setShowListBase([...list]);
        if(pageCurrent > 1){
            setPageCurrent(1);
        }else{
            await showListByPage([...list]);
        }
    }

    const toggleDetailShow = (blockNumber, isShow) => {
        blockNumber = blockNumber.toString()
        let newData = {...drawDetailShow};
        newData[blockNumber] = isShow;
        setDrawDetailShow(newData);
    }

    const initList = async (isReset) => {
        setIsLoading(true)
        if(isReset || allList.length == 0){
            let {_allList} = await getBlockListWithStatus()
            await showListByStatus(_allList)
        }else{
            await showListByPage();
        }
        setIsLoading(false)
    }


    useEffect(()=>{

        console.log('useEffect~')

        initList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBlock, pageCurrent])

    return (
    <>
        <Card title="Block List" subTitle={currentBlock.number?.toString()} reload={async ()=>{
            await initList(true);
        }}>
            <div className='row my-3'>
                <div className='col-4'>
                    <div className="input-group input-group-sm">
                        <select className="form-select" ref={statusSearchEl}>
                            {Object.keys(listStatus).map((v, i) => 
                                <option key={i} value={v}>{listStatus[v].name}</option>
                            )}
                        </select>
                        <button className="btn btn-outline-secondary" type="button" onClick={()=>{
                            let status = statusSearchEl.current.value;
                            console.log(status)
                            showListByStatus(listStatus[status].data);
                        }}> Search Status </button>
                    </div>
                </div>
                <div className='col'></div>
                <div className='col-4'>
                    <div className="input-group input-group-sm">
                        <input type="number" className="form-control" placeholder="Block Number..." ref={blockSearchEl}/>
                        <button className="btn btn-outline-secondary" type="button" onClick={()=>{
                            let blockNumber = blockSearchEl.current.value
                            if(blockNumber){
                                searchBlock(blockNumber)
                                blockSearchEl.current.value = ''
                            }
                        }}> Search Block </button>
                    </div>
                </div>
            </div>
            <List list={showList} isLoading={isLoading}>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>Block Info</th>
                            <th>Block Prize</th>
                            <th>Status</th>
                            <th>Draw Info</th>
                        </tr>
                    </thead>
                    <tbody>
                    {showList.map((item, i) => 
                        <tr key={i}>
                            <td>
                                <div className='mb-1'>Block Number: {amount(item.blockNumber, true)}</div>
                                <div>Tickets: {amount(item.tickets.length, true)}</div>
                            </td>
                            <td>
                                <div className='mb-1'>Block Prize: {glc(item.blockPrize)}</div>
                                <div>Block Eth Prize: {gleth(item.blockEthPrize)}</div>
                            </td>
                            <td>{listStatus[item.status].status}</td>
                            <td>
                                {item.drawNumber && item.drawNumber.length > 0 && item.drawNumber[0] > 0 ? (
                                <>
                                    <DrawGroupBalls drawNumbers={item.drawNumber}/>
                                    <a className="bi bi-card-list link-secondary link-primary-hover cursor-pointer fs-5 ms-3 align-middle" onClick={()=>{
                                        toggleDetailShow(item.blockNumber, true)
                                    }}></a>
                                    <Modal show={drawDetailShow[item.blockNumber.toString()]} size='lg' centered onHide={()=>{toggleDetailShow(item.blockNumber, false)}}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Block Number: {item.blockNumber.toString()}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <table className='table'>
                                                <thead>
                                                    <tr>
                                                        <th>Award</th>
                                                        <th>Award Eth</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <p className='mb-1'>Normal Award Sum Amount: {glc(item.normalAwardSumAmount)}</p>
                                                            <p className='mb-1'>Top Bonus Count: {amount(item.topBonusMultiples || 0)}</p>
                                                            {(item.isDraw || item.isRollup) && (
                                                                <p className='mb-1'>Top Bonus Sum Amount: {glc(item.topBonusSumAmount)}</p>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <p className='mb-1'>Normal Award Sum Amount: {gleth(item.normalAwardSumAmountByEth)}</p>
                                                            <p className='mb-1'>Top Bonus Count: {amount(item.topBonusMultiplesByEth || 0)}</p>
                                                            {(item.isDraw || item.isRollup) && (
                                                                <p className='mb-1'>Top Bonus Sum Amount: {gleth(item.topBonusSumAmountByEth)}</p>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {(item.isDraw || item.isRollup) && (
                                                <p className='mt-2 mb-1'>Opener: {amount(shortAddress(item.opener), true)}</p>
                                            )}
                                        </Modal.Body>
                                    </Modal>
                                </>
                                ) : '-'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <PageNav pageCount={pageCount} pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} />
            </List>
        </Card>

    </>

    )
}

