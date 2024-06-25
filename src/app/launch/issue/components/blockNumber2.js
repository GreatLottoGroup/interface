'use client';

import { useEffect, useRef } from 'react'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import { dateFormatLocal } from '@/launch/hooks/dateFormat'
import { PerBlockTime, IssueInterval} from '@/launch/hooks/globalVars'


export default function BlockNumberSelect({setLotteryBlockNumber, currentBlock}) {

    const config = useConfig();
    const lotteryBlockCycleEl = useRef(null)

    const getLotteryBlockTime = (n) => {
        if(n && currentBlock?.number){
            return Number((n - currentBlock.number) * PerBlockTime + currentBlock.timestamp) * 1000
        }else{
            return 0
        }
    }

    const getFirstCycleNumber = (curBlockNumber, offset) => {
        offset = offset || 3n
        return (curBlockNumber/IssueInterval + offset) * IssueInterval
    }

    const intiCycleOptions = (curBlockNumber) => {
        let firstNumber = getFirstCycleNumber(curBlockNumber)
        let options = []

        for(let i=0; i<100; i++){
            let bn = firstNumber + BigInt(i)*IssueInterval
            options.push(<option key={bn} value={bn}>{bn.toString()} &nbsp;&nbsp;&nbsp; {dateFormatLocal(getLotteryBlockTime(bn))}</option>);
        }
        return options;
    }

    const changeCycle = (val) => {
        setLotteryBlockNumber(BigInt(val))
    }
    
    const initInfo = async () => {
        const curBlockNumber = await getBlockNumber(config);
        // setDefault
        changeCycle(getFirstCycleNumber(curBlockNumber))
    }

    useEffect(() => {

        console.log('useEffect~')
        initInfo();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBlock])


    return (
        <>
            <div className="mb-2">
                <div>
                    <span className='fw-semibold'>Lottery block</span> 
                    <select className='form-select mt-1 mb-3' ref={lotteryBlockCycleEl} onChange={(e)=>{
                        changeCycle(e.target.value)
                    }}>
                        {currentBlock?.number && intiCycleOptions(currentBlock.number)}
                    </select>
                </div>            
            </div>
        </>

        
    )
}