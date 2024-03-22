'use client';

import Header from "@/components/header"    
import Footer from "./components/footer"
import TransactionBar from './components/transactionBar'


import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { isOwner } from '@/launch/hooks/globalVars'

import { useTransactions } from "./hooks/transactions";
import { SetTransactionContext } from './hooks/transactionsContext';

import { GlobalToast, useGlobalToast } from './hooks/globalToast'
import { SetGlobalToastContext } from './hooks/globalToastContext'

import { ConnectKitButton } from "connectkit";

import { useSelectedLayoutSegment } from 'next/navigation';

import './template.css'

const _navList = [
    {title: 'Issue', name:'issue', href: '/launch/issue'},
    {title: 'Explore', name:'explore',  href: '/launch/explore'},
    {title: 'Mine', name:'mine', href: '/launch/mine'},
    {title: 'Draw', name:'draw', href: '/launch/draw'},
    {title: 'Investment', name:'investment', href: '/launch/investment'},
    {title: 'DAO', name:'dao', href: '/launch/dao'},
    {title: 'SalesChannel', name:'channel', href: '/launch/channel'},
];
const ownerNav = {title: 'Management', name:'management', href: '/launch/management'};

export default function Template({ children }) {

    let segment = useSelectedLayoutSegment()

    const [connectedStatus, setConnectedStatus] = useState(false);
    const [navList, setNavList] = useState(_navList);

    const [pageNav, setPageNav] = useState(segment || 'overview')

    const { isConnected, address: accountAddress } = useAccount();

    const {transactions, setTransaction, checkTransactions, hasPendingTrans, delTransaction} = useTransactions();

    const {globalToast, setGlobalToast} = useGlobalToast()

    console.log(connectedStatus)

    useEffect(() => {
        setConnectedStatus(isConnected);
        if(isConnected && isOwner(accountAddress)){
            setNavList([..._navList, ownerNav])
        }else{
            setNavList([..._navList])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, accountAddress])
    
  return (
    <>
    {connectedStatus ? (
        <SetTransactionContext.Provider value={setTransaction}>
            <SetGlobalToastContext.Provider value={setGlobalToast}>
                <Header navList={navList} pageNav={pageNav} setPageNav={setPageNav}>
                    <ConnectKitButton /> 
                    <TransactionBar transactions={transactions} checkTransactions={checkTransactions} hasPendingTrans={hasPendingTrans} delTransaction={delTransaction}/>
                </Header>
                <div className='container px-5'>{children}</div>
                <GlobalToast globalToast={globalToast} setGlobalToast={setGlobalToast}></GlobalToast>
                <Footer></Footer>
            </SetGlobalToastContext.Provider>
        </SetTransactionContext.Provider>
    ) : (
        <>
            <Header navList={navList} pageNav={pageNav} setPageNav={setPageNav}>
                <ConnectKitButton /> 
            </Header>
            <div className='container px-5'><ConnectKitButton /></div>
            <Footer></Footer>
        </>

    )}

    </>

  )
}

