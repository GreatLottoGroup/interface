'use client';

import { useState, useEffect } from 'react'

import  useCurrentBlock  from '@/launch/hooks/currentBlock'

import DrawBlock from './components/drawBlock'
import LastDraw from './components/lastDraw'
import DrawList from './components/drawList'

export default function Draw() {

    const {currentBlock, setCurrentBlock} = useCurrentBlock()

    return (
    <>
        <div className='row mb-3'>
            <div className='col'>
                <LastDraw currentBlock={currentBlock}/>
            </div>
            <div className='col'>
                <DrawBlock setCurrentBlock={setCurrentBlock}/>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <DrawList currentBlock={currentBlock}/>
            </div>
        </div>
    </>

    )
}

