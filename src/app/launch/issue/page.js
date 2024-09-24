'use client';

import { useState, useEffect } from 'react'

import { Multiple, Periods} from './components/multiple'
import { BallSelect, BallGroup, sumCount} from './components/ball'
import BlockNumberSelect from './components/blockNumber'
import { PayCoin } from './components/payCoin'
import Issue from './components/issue'
import Channel from './components/channel'
import  useCurrentBlock  from '@/launch/hooks/currentBlock'
import './page.css'
import TotalShow from './components/totalShow';
import { PricePerCount, PricePerCountEth, formatAmount, parseAmount } from '@/launch/hooks/globalVars'
import { amount, usd, eth, gldc } from "@/launch/components/coinShow"
import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'

export default function IssueTicket() {

    const [numberList, setNumberList] = useState([])
    const [multiple, setMultiple] = useState(1)
    const [periods, setPeriods] = useState(1)
    const [lotteryBlockNumber, setLotteryBlockNumber] = useState(0)
    const [payCoin, setPayCoin] = useState({})
    const [channel, setChannel] = useState(0)
    const [isEth, setIsEth] = useState(false)

    const [daoReward, setDaoReward] = useState(0)

    const {currentBlock, setCurrentBlock} = useCurrentBlock()
    const { getMintShares } = useDaoCoin()

    const sumTotalCount = () => {
        return sumCount(numberList) * BigInt(multiple * periods);
    }
    const getPricePerCount = () => {
        return isEth ? formatAmount(PricePerCountEth) * 1 : Number(PricePerCount);
    }
    const sumTotalPrice = () => {
        let price = isEth ? PricePerCountEth : PricePerCount;
        let totalPrice = sumTotalCount() * price;
        return totalPrice;
    }

    const getDaoReward = async () => {
        let price = sumTotalPrice();
        if(!isEth){
            price = parseAmount(sumTotalPrice());
        }
        if(price > 0){
            let reward = await getMintShares(price, isEth);
            setDaoReward(reward);
        }else{
            setDaoReward(0);
        }
    }

    useEffect(() => {

        console.log('useEffect~')
        getDaoReward();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberList, multiple, periods, isEth])


  return (

    <>

        <BallSelect numberList={numberList} setNumberList={setNumberList}/>

        <BallGroup numberList={numberList} setNumberList={setNumberList}/>


        <div className='border px-3 py-3 mb-3 row'>
            <div className='col-2'>
                <div className='fw-semibold'>Current Block Number</div>
                <div className='mt-1 mb-3'>
                    {currentBlock?.number?.toString()}
                    <a className='btn btn-outline-secondary btn-sm ms-3' onClick={()=>{setCurrentBlock()}}>ReLoad</a>
                </div>
            </div>

            <div className='col-4 mx-2'>
                <BlockNumberSelect setLotteryBlockNumber={setLotteryBlockNumber} currentBlock={currentBlock}/>
            </div>
            <div className='col-2 mx-2'>
                <Periods periods={periods} setPeriods={setPeriods} />
            </div>
            <div className='col-2 mx-2'>
                <Multiple multiple={multiple} setMultiple={setMultiple} />
            </div>
        </div>
        <div className='border px-3 py-3 mb-3 row'>
            <div className='col'>

                <div className='ms-2 mb-2'>
                    <span className='fw-semibold pe-1'>Sum Count: </span>
                    <span className='fw-semibold pe-2'>{amount(sumTotalCount(), true)}</span>
                    <span className='text-body-tertiary'> = {sumCount(numberList).toString()} (Balls) * {periods} (Periods) * {multiple} (Multiple)</span>
                </div>
                <div className='ms-2 mb-2'>
                    <span className='fw-semibold pe-1'>Sum Price: </span>
                    <span className='fw-semibold pe-2'>{isEth ? eth(sumTotalPrice()) : usd(sumTotalPrice(), true)}</span>
                    <span className='text-body-tertiary'> = {sumTotalCount().toString()} (Sum Count) * {getPricePerCount()} (Per Count Price)</span> 
                </div>
                <div className='ms-2 mb-2'>
                    <span className='fw-semibold pe-1'>DAO Reward: </span>
                    <span className='fw-semibold pe-2'>{gldc(daoReward)}</span>
                </div>

                <TotalShow lotteryBlockNumber={lotteryBlockNumber}  periods={periods} currentBlock={currentBlock} isEth={isEth}/>
            </div>
        </div>

        <div className='border px-3 py-3 mb-3 row'>

            <PayCoin payCoin={payCoin} setPayCoin={setPayCoin} setCurrentBlock={setCurrentBlock} isEth={isEth} setIsEth={setIsEth}/>

            <div className='col-3 overflow-hidden'>
                <Channel channel={channel} setChannel={setChannel}/>
                <Issue numberList={numberList} setNumberList={setNumberList} multiple={multiple} periods={periods} lotteryBlockNumber={lotteryBlockNumber} payCoin={payCoin} setPayCoin={setPayCoin} setCurrentBlock={setCurrentBlock} channel={channel} isEth={isEth}/>
            </div>

        </div>


    </>

  )
}
