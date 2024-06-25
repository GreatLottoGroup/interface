'use client';

import './transactionBar.css'


import { useContext } from 'react';
import { DarkContext } from '@/hooks/darkContext';

import { useConfig } from 'wagmi'
import { watchChainId } from '@wagmi/core'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'next/image'
import { chains } from '@/launch/hooks/globalVars'

export default function TransactionBar({transactions, checkTransactions, hasPendingTrans, delTransaction}) {
    
    const isDark = useContext(DarkContext)

    const config = useConfig();
    
    const chainId = config.state.chainId;
    const chainName = chains[chainId]

    const statusElm = (s) => {
        if(s == 'success'){
            return <div className='trans-status text-success text-capitalize'>{s}</div>
        }else if(s == 'reverted'){
            return <div className='trans-status text-danger text-capitalize'>{s}</div>
        }else{
            return (
                <div className="trans-status text-warning">
                    <span className='text-capitalize'>{s}</span>
                    <div className="spinner-border spinner-border-sm ms-1 align-bottom"></div>
                </div>
            )
        }
    }

    const tipElm = () => {
        let hasPending = hasPendingTrans(transactions);
        if(hasPending > -1){
            return <span className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"></span>
        }else{
            return ''
        }
    }

    const getTransLink = (hash) => {
        let perHost = ''
        if(chainId == 11155111 || chainId == 17000){
            perHost = chainName + '.'
        }
        return 'https://' + perHost + 'etherscan.io/tx/' + hash;
    }

    const transactionsList = () => {
        if(transactions.length > 0){
            let _transactions = [...transactions];
            _transactions.reverse();
            return (_transactions.map((trans, i) => 
                <li className="dropdown-item" key={i}>
                    <a className="row text-reset text-decoration-none" target="_blank" href={getTransLink(trans.hash)}>
                        <div className="col trans-action text-capitalize">{trans.action}</div>
                        <div className="col text-end">
                            {statusElm(trans.status)}
                            <div className='trans-time text-secondary'>{trans.time}</div>
                        </div>
                    </a>
                </li>
            ))
        }else{
            return <li className="dropdown-item-text text-muted">No Transactions</li>
        }
    }

    watchChainId(config, {
        onChange(chainId) {
          window.location.reload();
        }
    })
 
    return (
    <>

    <Dropdown className="ms-3" align="end" autoClose="outside">
        <Dropdown.Toggle variant={isDark ? 'dark' : 'light'} bsPrefix=' '>
            <Image src={"/ethereum.svg"} alt='ethereum' width="20" height="20" className='me-1 align-text-top'/>
            <span className='text-capitalize align-text-top fs-5'>{chainName}</span>
            {tipElm()}
        </Dropdown.Toggle>

        <Dropdown.Menu className="transaction-bar" as="ul">
            <li className="dropdown-header">Your Transaction
            <button className='transaction-action btn btn-light float-end btn-sm' onClick={()=>{delTransaction()}}><i className="bi bi-trash3"></i></button>
            <button className='transaction-action btn btn-light float-end btn-sm me-2' onClick={()=>{checkTransactions()}}><i className="bi bi-arrow-clockwise"></i></button>
            </li>
            {transactionsList()}
        </Dropdown.Menu>
    </Dropdown>


    </>
  
    )
  }
  