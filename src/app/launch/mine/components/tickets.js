'use client';

import './tickets.css'
import Modal from 'react-bootstrap/Modal';

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'

import { useDrawNumbers, drawTicketList } from '@/launch/hooks/drawNumbers'
import { dateFormatLocal } from '@/launch/hooks/dateFormat'

import { BlockPeriods, PerBlockTime, getTokenName } from '@/launch/hooks/globalVars'
import { Ball } from '@/launch/hooks/balls'
import { usePageNav, PageNav } from '@/launch/hooks/pageNav'

import useGreatLottoNft from '@/launch/hooks/contracts/GreatLottoNft'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'


export default function Tickets({accountAddress, currentBlock, setCurrentBlock}) {

    const publicClient = usePublicClient()
    const [nftList, setNftList] = useState([])
    const [tickets, setTickets] = useState({})
    const [ticketsShow, setTicketsShow] = useState({})

    const { getNftBalance, getNftToken, getNftTicket, getNftSVG } = useGreatLottoNft()
    const { getBlockDrawStatus } = usePrizePool()

    const { getDrawNumber } = useDrawNumbers()

    const { getPageNavInfo, pageCurrent, pageCount, setPageCurrnet } = usePageNav()
    
    const getNftList = async () => {

        let page = pageCurrent || 1

        let balance = await getNftBalance();
        let curBlockNumber = await publicClient.getBlockNumber()

        let list = [];

        if(balance == 0n){
            return false;
        }

        let [pageCount, startIndex, endIndex] = getPageNavInfo(Number(balance));

        console.log('page: ' + page);
        console.log('balance: ' + balance);
        console.log('startIndex: ' + startIndex);
        console.log('endIndex: ' + endIndex);
        console.log('pageCount: ' + pageCount);
        
        for(let i = startIndex; i < endIndex; i++){
            let token = await getNftToken(i);
            let ticket = await getNftTicket(token);
            let targetBlocks = [];
            
            for(let j = 0; j < ticket.periods; j++){
                let bn =  ticket.targetBlockNumber + BlockPeriods*BigInt(j);
                let blockData = { blockNumber: bn }
                if(bn < curBlockNumber - BlockPeriods){
                    blockData.drawNumbers = await getDrawNumber(bn);
                    blockData.drawStatus = await getBlockDrawStatus(bn);
                }else{
                    blockData.drawNumbers = [];
                    blockData.drawStatus = {};
                }
                targetBlocks.push(blockData)
            }

            list.push({ targetBlocks, ...ticket })
        }

        console.log(list)
        setNftList(list);

        return list;

    }

    const getTicket = async (token) => {
        if(!tickets[token.toString()]){
            let svg = await getNftSVG(token);
            let newList = {...tickets};
            newList[token.toString()] = svg
            setTickets(newList);
        }
    }

    const toggleTicketShow = (token, isShow) => {
        token = token.toString()
        let newData = {...ticketsShow};
        newData[token] = isShow;
        setTicketsShow(newData)
    }

    const getIsDrawFormDrawList = (targetBlocks, num, isBlue) => {
        let isDraw = false
        for(let i = 0; i < targetBlocks.length; i++){
            if(isBlue){
                if(targetBlocks[i].drawNumbers.slice(0,6).indexOf(num) > -1){
                    isDraw = true;
                    break;
                }
            }else{
                if(targetBlocks[i].drawNumbers[6] == num){
                    isDraw = true;
                    break;
                }
            }
        }
        return isDraw;
    }

    const getIsDrawFormNumsList = (numsList, num, isBlue) => {
        let isDraw = false
        for(let i = 0; i < numsList.length; i++){
            if(isBlue){
                if(numsList[i][0].indexOf(num) > -1 || numsList[i][1].indexOf(num) > -1){
                    isDraw = true;
                    break;
                }
            }else{
                if(numsList[i][2].indexOf(num) > -1){
                    isDraw = true;
                    break;
                }
            }
        }
        return isDraw;
    }

    const getWaitingDraw = (targetNumber) => {
        let time = Number((targetNumber - currentBlock.number + BlockPeriods) * PerBlockTime + currentBlock.timestamp) * 1000
        return (
            <>
            <div>Waiting... </div>
            <div>Estimate: &nbsp;
                {dateFormatLocal(time)} 
            </div>
            </>
        )
    }

    const getDrawStatus = (numsList, block) => {

        let drawNumbers = block.drawNumbers;
        let drawStatus = block.drawStatus;
        //test
        /*
        drawNumbers[0] = 32
        drawNumbers[1] = 33
        drawNumbers[2] = 34
        drawNumbers[3] = 35
        drawNumbers[4] = 36
        drawNumbers[5] = 37
        drawNumbers[6] = 14
        */

        let [bonus, topBouns] = drawTicketList(numsList, drawNumbers);

        drawNumbers = [...drawNumbers.slice(0, 6).sort((a,b) => {return a-b;}), drawNumbers[6]]

        return (
            <>
            <div>Winning Numbers: </div>
            <div>
                {drawNumbers.map((num, i) => (
                    <Ball number={num} key={i} type={i < 6 ? 'brave' : 'red'} isDraw={getIsDrawFormNumsList(numsList, num, i < 6)}/>
                ))}
            </div>
            <div>Draw Status: &nbsp;
                {drawStatus.isDraw ? (
                    <span className="badge text-bg-success">Has Been Brawn</span>
                ) : (
                    <span className="badge text-bg-danger">No Drawn</span>
                )}
                {(bonus == 0 && topBouns == 0) ? (
                    <div>Losing Lottery</div>
                ) : (
                <>
                    <div>Ordinary Prize: {bonus}</div>
                    <div>Top Prize: {topBouns}</div>
                </>
                )}
            </div>
            </>
        )
        
    }

    useEffect(()=>{

        console.log('useEffect~')

        getNftList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, currentBlock, publicClient, pageCurrent])


  return (
    <>

    <div className='border px-3 py-3 mb-3 row'>
        <div className='col'>
            <div className='h5'>My Tickets
                <a className="btn btn-sm btn-outline-secondary ms-3" onClick={()=>{setCurrentBlock();}}>ReLoad</a>
            </div>
            {nftList.length > 0 ? (
                <>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>Ticket</th>
                            <th>Numbers</th>
                            <th>Counts</th>
                            <th>Price</th>
                            <th>TargetBlock</th>
                            <th>Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {nftList.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <a className="bi bi-ticket-detailed fs-2 d-inline-block nft-ticket link-secondary link-primary-hover" onClick={()=>{getTicket(item.tokenId);toggleTicketShow(item.tokenId, true)}}></a>
                                <Modal show={ticketsShow[item.tokenId.toString()]} centered onHide={()=>{toggleTicketShow(item.tokenId, false)}}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>TokenId: {item.tokenId.toString()}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {tickets[item.tokenId.toString()] ? (
                                            <div className='nft-ticket-svg text-center' dangerouslySetInnerHTML={{__html:tickets[item.tokenId.toString()]}}></div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>                                    
                                        )}
                                    </Modal.Body>
                                </Modal>
                            </td>
                            <td>
                                {item.numbers.map((ball, bi) => (
                                    <div key={bi}>
                                        {ball[0].map((num, i) => (
                                            <Ball number={num} key={i} type="brave" isDraw={getIsDrawFormDrawList(item.targetBlocks, num, true)}/>
                                        ))}
                                        {ball[1].map((num, i) => (
                                            <Ball number={num} key={i} type="blue" isDraw={getIsDrawFormDrawList(item.targetBlocks, num, true)}/>
                                        ))}
                                        {ball[2].map((num, i) => (
                                            <Ball number={num} key={i} type="red" isDraw={getIsDrawFormDrawList(item.targetBlocks, num, false)}/>
                                        ))}
                                    </div>
                                ))}
                            </td>
                            <td>
                                <div>Periods: {item.periods}</div>
                                <div>Multiple: {item.multiple}</div>
                                <div>Counts: {item.count.toString()}</div>
                            </td>
                            <td>
                                <div>{item.amount.toString()} {getTokenName(item.payToken)}</div>
                            </td>
                            <td>
                                {item.targetBlocks.map((b, i) => (
                                    <div key={i}>{b.blockNumber.toString()}</div>
                                ))}
                            </td>
                            <td>
                            {currentBlock.number && (item.targetBlocks.map((block, i)=>                                
                                <div key={i} className='mb-2'>
                                    <strong>TargetBlock: </strong>{block.blockNumber.toString()}
                                    {(block.blockNumber >= currentBlock.number - BlockPeriods) ? getWaitingDraw(block.blockNumber) : getDrawStatus(item.numbers, block)}
                                </div>
                            ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <PageNav pageCount={pageCount} pageCurrent={pageCurrent} setPageCurrnet={setPageCurrnet} />
                </>
            ) : (
                <div>No Tickets</div>
            )}

        </div>
    </div>

    </>

  )
}

