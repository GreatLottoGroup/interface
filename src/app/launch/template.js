'use client';

import Header from "@/components/header"    
import Footer from "./components/footer"
import Wallet from './components/wallet'

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { ConnectKitButton } from "connectkit";

import { useSelectedLayoutSegment } from 'next/navigation';

import './template.css'


export default function Template({ children }) {

    let segment = useSelectedLayoutSegment()

    const [conectedStatus, setConectedStatus] = useState(false);

    const [pageNav, setPageNav] = useState(segment || 'overview')

    const { isConnected } = useAccount()

    useEffect(() => {
        setConectedStatus(isConnected);
    }, [isConnected])
    
  return (
    <>

        <Header navList={[
            {title: 'Overview', name:'overview',  href: '/launch'},
            {title: 'Issue', name:'issue', href: '/launch/issue'},
            {title: 'Mine', name:'mine', href: '/launch/mine'},
            {title: 'Draw', name:'draw', href: '/launch/draw'},
            {title: 'Investment', name:'investment', href: '/launch/investment'},
            {title: 'DAO', name:'dao', href: '/launch/dao'},
            {title: 'SalesChannel', name:'channel', href: '/launch/channel'},
            {title: 'Management', name:'management', href: '/launch/management'},
        ]} pageNav={pageNav} setPageNav={setPageNav}>
            <Wallet/>
        </Header>

        <div className='container px-5'>

            {conectedStatus ? ( children ):(
                <ConnectKitButton />
            )}

        </div>

        <Footer></Footer>

    </>

  )
}

