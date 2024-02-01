'use client';

import { useState } from 'react'

import { Multiple, Periods} from './components/multiple'
import { BallSelect, BallGroup, sumCount} from './components/ball'
import BlockNumberSelect from './components/blockNumber'
import { PayCoin } from './components/payCoin'
import Issue from './components/issue'
import Channel from './components/channel'
import  useCurrentBlock  from '@/launch/hooks/currentBlock'

export default function IssueTicket() {

    const [numberList, setNumberList] = useState([])
    const [multiple, setMultiple] = useState(1)
    const [periods, setPeriods] = useState(1)
    const [lotteryBlockNumber, setLotteryBlockNumber] = useState(0)
    const [payCoin, setPayCoin] = useState({})
    const [channel, setChannel] = useState(0)

    const {currentBlock, setCurrentBlock} = useCurrentBlock()

  return (

    <>

        <BallSelect numberList={numberList} setNumberList={setNumberList}/>

        <BallGroup numberList={numberList} setNumberList={setNumberList}/>

        <div className='border px-3 py-3 mb-3 row'>
            <div className='col-2 mx-2'>
                <Periods periods={periods} setPeriods={setPeriods} />
            </div>
            <div className='col-2 mx-2'>
                <Multiple multiple={multiple} setMultiple={setMultiple} />
            </div>
            <div className='col mx-2'>
                <div>Sum Count: {sumCount(numberList)}</div>
                <div>Sum Price: {sumCount(numberList) * multiple * periods} $ </div>
                <div>(Per Count Price: 1 $)</div>
            </div>
        </div>

        <BlockNumberSelect lotteryBlockNumber={lotteryBlockNumber} setLotteryBlockNumber={setLotteryBlockNumber} currentBlock={currentBlock} setCurrentBlock={setCurrentBlock} />
        
        
        <div className='border px-3 py-3 mb-3 row'>

            <PayCoin payCoin={payCoin} setPayCoin={setPayCoin} setCurrentBlock={setCurrentBlock}/>

            <div className='col-3 overflow-hidden'>
                <Channel channel={channel} setChannel={setChannel}/>
                <Issue numberList={numberList} setNumberList={setNumberList} multiple={multiple} periods={periods} lotteryBlockNumber={lotteryBlockNumber} payCoin={payCoin} setPayCoin={setPayCoin} setCurrentBlock={setCurrentBlock} channel={channel} />
            </div>

        </div>


    </>

  )
}
