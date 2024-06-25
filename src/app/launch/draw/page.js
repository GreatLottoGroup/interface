'use client';

import  useCurrentBlock  from '@/launch/hooks/currentBlock'

import DrawTicket from './components/drawTicket'
import Rollup from './components/rollup'
import BlockList from './components/blockList'

export default function Draw() {

    const {currentBlock, setCurrentBlock} = useCurrentBlock()

    return (
    <>
        <div className='row mb-3'>
            <div className='col'>
                <DrawTicket setCurrentBlock={setCurrentBlock}/>
            </div>
        </div>
        <div className='row mb-3'>
            <div className='col'>
                <Rollup setCurrentBlock={setCurrentBlock}/>
            </div>
        </div>
        <div className='row mb-3'>
            <div className='col'>
                <BlockList currentBlock={currentBlock}/>
            </div>
        </div>
    </>

    )
}

