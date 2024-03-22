'use client';


import  useCurrentBlock  from '@/launch/hooks/currentBlock'

import Tickets from './components/tickets'
import Account from './components/account'

export default function Mine() {

    const {currentBlock, setCurrentBlock} = useCurrentBlock()

  return (
    <>

    <Account currentBlock={currentBlock} setCurrentBlock={setCurrentBlock}></Account>
    <Tickets currentBlock={currentBlock} setCurrentBlock={setCurrentBlock}></Tickets>

    </>

  )
}

