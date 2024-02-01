'use client';


import { useState, useEffect } from 'react'

import { useAccount } from 'wagmi'
import  useCurrentBlock  from '@/launch/hooks/currentBlock'

import Tickets from './components/tickets'
import Account from './components/account'

export default function Mine() {

    const { address: accountAddress } = useAccount()
    const {currentBlock, setCurrentBlock} = useCurrentBlock()

  return (
    <>

    <Account accountAddress={accountAddress} currentBlock={currentBlock} setCurrentBlock={setCurrentBlock}></Account>
    <Tickets accountAddress={accountAddress} currentBlock={currentBlock} setCurrentBlock={setCurrentBlock}></Tickets>

    </>

  )
}

