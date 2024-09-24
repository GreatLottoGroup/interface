'use client';

import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import Card from '@/launch/components/card'
import List from '@/launch/components/list'

import { DrawGroupBalls } from '@/launch/hooks/balls'
import { BlockPeriods, shortAddress, getBlockTime } from '@/launch/hooks/globalVars'
import { usePageNav, PageNav } from '@/launch/hooks/pageNav'
import {useTargetBlock} from '@/launch/hooks/targetBlock'
import { drawTicketList } from '@/launch/hooks/drawNumbers'
import { glc, gleth, amount } from "@/launch/components/coinShow"
import { dateFormatLocal } from '@/launch/hooks/dateFormat'

export default function BlockList({currentBlock}) {

    const config = useConfig();

    const [showList, setShowList] = useState([])
    const [curStatus, setCurStatus] = useState('all')
    const {listStatus, getBlockListFromServer, getBlockListByStatusFromServer, searchBlockFromServer, getTicketsByTokensFromServer} = useTargetBlock()

    const [isLoading, setIsLoading] = useState(false);

    const [drawDetailShow, setDrawDetailShow] = useState({})

    const blockSearchEl = useRef(null)

    const { getPageNavInfo, pageCurrent, pageCount, setPageCurrent, pageSize } = usePageNav()

    const _showBlock = async  (info, curBlockNumber) => {
        let maxNumber = curBlockNumber - BlockPeriods;
        console.log(info);
        // drawNumber
        if(info.status != 'drawn' && info.blockNumber <= maxNumber){
            let numberList = [];
            let ticketList = await getTicketsByTokensFromServer(info.tickets);
            for (let ti = 0; ti < ticketList.length; ti++) {
                let t = ticketList[ti];
                numberList = [...numberList, ...t.numbers]
            }
            [info.normalAwardSumAmount, info.topBonusMultiples] = drawTicketList(numberList, info.drawNumber, false);
            [info.normalAwardSumAmountByEth, info.topBonusMultiplesByEth] = drawTicketList(numberList, info.drawNumber, true);
        }
        return info;

    }

    const _showBlockList = async (list) => {
        let curBlockNumber = await getBlockNumber(config);
        let _list = [];
        for (let i = 0; i < list.length; i++) {
            let info = await _showBlock(list[i], curBlockNumber);
            _list.push(info);
        }
        return _list;
    }

    const searchBlock = async (blockNumber) => {
        let result = await searchBlockFromServer(blockNumber);
        setShowList(await _showBlockList(result));
        getPageNavInfo(1);
    }
    
    const showListByStatus = async (status, page) => {
        let result, count;
        status = status || curStatus;
        page = page || pageCurrent;
        
        if(status == 'all'){
            ({result, count} = await getBlockListFromServer(page, pageSize));
        }else{
            ({result, count} = await getBlockListByStatusFromServer(status, null, page, pageSize));
        }

        getPageNavInfo(count);

        setShowList(await _showBlockList(result));
    }

    const toggleDetailShow = (blockNumber, isShow) => {
        blockNumber = blockNumber.toString()
        let newData = {...drawDetailShow};
        newData[blockNumber] = isShow;
        setDrawDetailShow(newData);
    }

    const initBlockList = async () => {
        setIsLoading(true)
        if(curStatus){
            await showListByStatus()
        }
        setIsLoading(false)
    }

    const getBlockDrawTime =  (blockNumber) => {
        const time = getBlockTime(blockNumber, currentBlock)
        if(time){
            return dateFormatLocal(time)
        }else{
            return '-'
        }
    }

    useEffect(()=>{

        console.log('useEffect~')

        initBlockList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageCurrent, curStatus])

    return (
    <>
        <Card title="Block List" subTitle={currentBlock.number?.toString()} reload={()=>{
            initBlockList();
        }}>
            <div className='row my-3'>
                <div className='col-3'>
                    <select className="form-select form-select-sm" onChange={(e)=>{
                        let status = e.target.value;
                        console.log(status)
                        setCurStatus(status);
                        setPageCurrent(1);
                    }}>
                        {Object.keys(listStatus).map((v, i) => 
                            <option key={i} value={v} selected={v == curStatus}>{listStatus[v].name}</option>
                        )}
                    </select>
                </div>
                <div className='col'></div>
                <div className='col-4'>
                    <div className="input-group input-group-sm">
                        <input type="number" className="form-control" placeholder="Block Number..." ref={blockSearchEl}/>
                        <button className="btn btn-outline-secondary" type="button" onClick={()=>{
                            let blockNumber = blockSearchEl.current.value
                            if(blockNumber){
                                setCurStatus(null);
                                setPageCurrent(1);
                                searchBlock(blockNumber);
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
                                <div className='mb-1'>Block Prize: {glc(item.blockBalance)}</div>
                                <div>Block Eth Prize: {gleth(item.blockBalanceEth)}</div>
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
                                ) : getBlockDrawTime(item.blockNumber)}
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

