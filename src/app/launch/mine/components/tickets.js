'use client';

import './tickets.css'
import Modal from 'react-bootstrap/Modal';

import { useState, useEffect } from 'react'
import { useConfig, useAccount } from 'wagmi'

import { drawTicketList } from '@/launch/hooks/drawNumbers'
import { dateFormatLocal } from '@/launch/hooks/dateFormat'

import { BlockPeriods, IssueInterval, getBlockTime } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import { Ball } from '@/launch/hooks/balls'
import { usePageNav, PageNav } from '@/launch/hooks/pageNav'

import useGreatLottoNft from '@/launch/hooks/contracts/GreatLottoNft'
import useCurrentBlock  from '@/launch/hooks/currentBlock'
import Card from '@/launch/components/card'
import List from '@/launch/components/list'
import {getStatusEl} from '@/launch/hooks/targetBlock'
import { coinShow, glc, gleth, amount } from "@/launch/components/coinShow"
import Tooltips from "@/launch/components/tooltips"
import {useTargetBlock} from '@/launch/hooks/targetBlock'

export default function Tickets() {

    const config = useConfig();
    const {currentBlock, setCurrentBlock} = useCurrentBlock()
    const chainId = config.state.chainId;
    const { address: accountAddress } = useAccount()

    const { getTokenName, GreatNftContractAddress } = useAddress();

    const [nftList, setNftList] = useState([])
    const [tickets, setTickets] = useState({})
    const [ticketsShow, setTicketsShow] = useState({})
    const [statusShow, setStatusShow] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [NFTSVGAddress, setNFTSVGAddress] = useState();

    const { getNftSVG, getNFTSVGAddress } = useGreatLottoNft()

    const { getPageNavInfo, pageCurrent, pageCount, setPageCurrent, pageSize } = usePageNav()

    const {getBlockListByNumbersFromServer, getTicketsByOwnerFromServer} = useTargetBlock()
    
    const getNftList = async (page) => {

        page = page || pageCurrent;
        
        const {result, count} = await getTicketsByOwnerFromServer(accountAddress, page, pageSize);
        
        getPageNavInfo(count);
        
        let blockNumbers = [];
        for(let i = 0; i < result.length; i++){
            let _ticket = result[i];
            for(let j = 0; j < _ticket.periods; j++){
                let bn = BigInt(_ticket.targetBlockNumber) + IssueInterval*BigInt(j);
                if(blockNumbers.indexOf(bn) == -1){
                    blockNumbers.push(bn)
                }
            }
        }
        
        const targetBlocks = await getBlockListByNumbersFromServer(blockNumbers);

        const targetBlocksMap = {};

        for(let i = 0; i < targetBlocks.length; i++){
            let bn = targetBlocks[i].blockNumber;
            targetBlocksMap[bn] = targetBlocks[i]
        }
        
        let list = [];

        for(let i = 0; i < result.length; i++){
            let _ticket = result[i];
            let _targetBlocks = [];
            for(let j = 0; j < _ticket.periods; j++){
                let bn = BigInt(_ticket.targetBlockNumber) + IssueInterval*BigInt(j);
                _targetBlocks.push(targetBlocksMap[bn]);
            }
            list.push({ targetBlocks: _targetBlocks, ..._ticket })
        }

        //console.log(list)
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

    const getOpenSeaUrl = (tokenId) => {
        let url;
        if(chainId == '11155111'){
            url = 'https://testnets.opensea.io/assets/sepolia/'
        }else{
            url = 'https://opensea.io/assets/'
        }
        url += GreatNftContractAddress + '/' + tokenId;
        return url;
    }

    const toggleTicketShow = (token, isShow) => {
        token = token.toString()
        let newData = {...ticketsShow};
        newData[token] = isShow;
        setTicketsShow(newData)
    }

    const toggleStatusShow = (token, isShow) => {
        token = token.toString()
        let newData = {...statusShow};
        newData[token] = isShow;
        setStatusShow(newData)
    }


    const getIsDrawFormDrawList = (targetBlocks, num, isBlue) => {
        let isDraw = false
        for(let i = 0; i < targetBlocks.length; i++){
            if(isBlue){
                if(targetBlocks[i].drawNumber.slice(0,6).indexOf(num) > -1){
                    isDraw = true;
                    break;
                }
            }else{
                if(targetBlocks[i].drawNumber[6] == num){
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

    const getWinNumbers = (numsList, block) => {
        console.log('getWinNumbers: ', numsList, block)

        if(block.blockNumber >= currentBlock.number - BlockPeriods){
            let time = getBlockTime(block.blockNumber, currentBlock)
            if(time){
                return amount(dateFormatLocal(time), true);
            }else{
                return '-'
            }
        }else{
            let drawNumber = block.drawNumber;
            //test
            /*
            drawNumber[0] = 32
            drawNumber[1] = 33
            drawNumber[2] = 34
            drawNumber[3] = 35
            drawNumber[4] = 36
            drawNumber[5] = 37
            drawNumber[6] = 14
            */
            drawNumber = [...drawNumber.slice(0, 6).sort((a,b) => {return a-b;}), drawNumber[6]]

            return (
            <>
                {drawNumber.map((num, i) => (
                    <Ball number={num} key={i} type={i < 6 ? 'brave' : 'red'} isDraw={getIsDrawFormNumsList(numsList, num, i < 6)}/>
                ))}
            </>
            )
        }

    }

    const getDrawDetail = (numsList, block, isEth) => {
        if(block.blockNumber >= currentBlock.number - BlockPeriods){
            return '-'
        }else{
            let drawNumber = block.drawNumber;    
            let [bonus, topBonus] = drawTicketList(numsList, drawNumber, isEth);
    
            return (
            <>
                 {(bonus == 0 && topBonus == 0) ? (
                    <span className='badge danger-bg-subtle'>Losing Lottery</span>
                ) : (
                <>
                    <div className='mb-1'>
                        <Tooltips title="Normal Award">{isEth ? gleth(bonus) : glc(bonus)}</Tooltips>
                    </div>
                    <div>
                        <Tooltips title="Top Bonus Count">{amount(topBonus, true)}</Tooltips>
                    </div>
                </>
                )}
            </>
            )
        }
    }

    const getDrawStatus = (block) => {
        let drawStatusEl;
        if(!currentBlock.number){
            return;
        }
        if(block.blockNumber >= Number(currentBlock.number - BlockPeriods)){
            drawStatusEl = getStatusEl('waitingDraw')
        }else if(block.isDraw){
            drawStatusEl = getStatusEl('drawn')
        }else if(block.isRollup){
            drawStatusEl = getStatusEl('rolled')
        }else if(block.blockNumber >= Number(currentBlock.number - 256n)){
            drawStatusEl = getStatusEl('waitingDraw')
        }else{
            drawStatusEl = getStatusEl('waitingRollup')
        }

        return drawStatusEl
        
    }

    const initNftList = async () => {
        setIsLoading(true)
        await getNftList()
        setNFTSVGAddress(await getNFTSVGAddress())
        setIsLoading(false)
    }


    useEffect(()=>{

        console.log('useEffect~')
        initNftList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, pageCurrent])


  return (
    <>

        <Card title="My Tickets" subTitle={currentBlock.number?.toString()} reload={async ()=>{setCurrentBlock(); await initNftList();}}>
            <List list={nftList} isLoading={isLoading}>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th className="col-1">Ticket</th>
                            <th>Numbers</th>
                            <th className="col-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {nftList.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <a className="bi bi-ticket-detailed fs-4 d-inline-block nft-ticket link-secondary link-primary-hover" onClick={()=>{getTicket(item.tokenId);toggleTicketShow(item.tokenId, true)}}></a>
                                <Modal show={ticketsShow[item.tokenId.toString()]} size='lg' centered onHide={()=>{toggleTicketShow(item.tokenId, false)}}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Ticket Detail</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className='mb-1 text-body-tertiary'>GreatLottoNFT: {GreatNftContractAddress}</div>
                                        <div className='mb-1 text-body-tertiary'>GreatLottoNFTSVG: {NFTSVGAddress}</div>
                                        <div className='row mt-3'>
                                            <div className='col'>
                                                {tickets[item.tokenId.toString()] ? (
                                                    <a target='_blank' href={getOpenSeaUrl(item.tokenId.toString())}>
                                                        <div className='nft-ticket-svg text-center' dangerouslySetInnerHTML={{__html:tickets[item.tokenId.toString()]}}></div>
                                                    </a>
                                                ) : (
                                                    <div className="text-center mt-5">
                                                        <div className="spinner-border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>                                    
                                                )}
                                            </div>
                                            <div className='col'>
                                                <div className='mb-1'>TokenId: {amount(item.tokenId, true)}</div>
                                                <div className='mb-1'>Multiple: {amount(item.multiple, true)}</div>
                                                <div className='mb-1'>Periods: {amount(item.periods, true)}</div>
                                                <div className='mb-1'>Target Block: {amount(item.targetBlockNumber, true)}</div>
                                                <div className='mb-1'>Counts: {amount(item.count, true)}</div>
                                                <div className='mb-1'>Price: {coinShow(getTokenName(item.payToken), item.amount, !item.isEth)}</div>
                                                <div className='mb-1'>Channel: {amount(item.channelId, true)}</div>
                                            </div>
                                        </div>
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
                                <span>{getDrawStatus(item.targetBlocks[0])}</span>
                                <a className="bi bi-card-list link-secondary link-primary-hover cursor-pointer fs-4 ms-3 align-middle" onClick={()=>{
                                    toggleStatusShow(item.tokenId, true)
                                }}></a>
                                <Modal show={statusShow[item.tokenId.toString()]} size='lg' centered onHide={()=>{toggleStatusShow(item.tokenId, false)}}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Draw Status TokenId: {item.tokenId.toString()}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                    <table className='table table-hover'>
                                        <thead>
                                            <tr>
                                                <th className="col-2">Target Block</th>
                                                <th>Winning Numbers</th>
                                                <th className="col-2">Status</th>
                                                <th className="col-3">Award</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {currentBlock.number && (item.targetBlocks.map((block, i)=>                                
                                            <tr key={i}>
                                                <td>{amount(block.blockNumber, true)}</td>
                                                <td>{getWinNumbers(item.numbers, block)}</td>
                                                <td>{getDrawStatus(block)}</td>
                                                <td>{getDrawDetail(item.numbers, block, item.isEth)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    </Modal.Body>
                                </Modal>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <PageNav pageCount={pageCount} pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} />
            </List>
        </Card> 


    </>

  )
}

