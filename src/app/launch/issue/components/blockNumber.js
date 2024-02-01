'use client';

import { useState, useEffect, useRef } from 'react'
import { usePublicClient } from 'wagmi'

import { dateFormatLocal, dateFormatMid, dateFormatUTC } from '@/launch/hooks/dateFormat'
import { PerBlockTime } from '@/launch/hooks/globalVars'


const nearestBlockCount = 600n;
const blockIssuePeriods = 300n

export default function BlockNumberSelect({lotteryBlockNumber, setLotteryBlockNumber, currentBlock, setCurrentBlock}) {

    const [numberSelectType, setNumberSelectType] = useState(0)
    const [isCycle, setIsCycle] = useState(true)

    const publicClient = usePublicClient()

    const lotteryBlockCycleEl = useRef(null)
    const lotteryBlockNumberEl = useRef(null)
    const lotteryBlockNumberTimeEl = useRef(null)


    const getLotteryBlockTime = (n) => {
        if(n && currentBlock?.number){
            return Number((n - currentBlock.number) * PerBlockTime + currentBlock.timestamp) * 1000
        }else{
            return 0
        }
    }

    const getFirstCycleNumber = (curBlockNumber, offset) => {
        offset = offset || 3n
        return (curBlockNumber/blockIssuePeriods + offset) * blockIssuePeriods
    }

    const intiCycleOptions = (curBlockNumber) => {
        let firstNumber = getFirstCycleNumber(curBlockNumber)
        let options = []

        for(let i=0; i<100; i++){
            let bn = firstNumber + BigInt(i)*blockIssuePeriods
            options.push(<option key={bn} value={bn}>{bn.toString()} &nbsp;&nbsp;&nbsp; {dateFormatLocal(getLotteryBlockTime(bn))}</option>);
        }
        return options;
    }

    const changeCycle = (val) => {
        setLotteryBlockNumber(BigInt(val))
    }

    const changeNumber = (val, isC) => {
        let num = BigInt(Math.trunc(val * 1));
        if(isC == undefined){
            isC = isCycle
        }
        if(isC){
            num = getFirstCycleNumber(num, 1n)
        }
        if(num >= currentBlock.number + nearestBlockCount){
            setLotteryBlockNumber(num)
        }
    }

    const changeTime = (val, isC) => {
        if(isC == undefined){
            isC = isCycle
        }
        let time = new Date(val);
        let curTime = new Date(Number(currentBlock.timestamp)*1000);
        let minTime = new Date(getLotteryBlockTime(currentBlock.number + nearestBlockCount))
        if(time >= minTime){
            let t = time - curTime;
            let num = currentBlock.number + BigInt(t)/PerBlockTime/BigInt(1000);
            if(isC){
                num = getFirstCycleNumber(num, 1n)
            }
            setLotteryBlockNumber(num)
        }
    }
    
    const initInfo = async () => {
        const curBlockNumber = await publicClient.getBlockNumber()
        lotteryBlockNumberEl.current.value =  Number(curBlockNumber + nearestBlockCount)
        lotteryBlockNumberTimeEl.current.value = dateFormatMid(getLotteryBlockTime(curBlockNumber + nearestBlockCount))
        // setDefault
        setLotteryBlockNumber(getFirstCycleNumber(curBlockNumber));
    }

    useEffect(() => {

        console.log('useEffect~')
        initInfo();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBlock, publicClient])


    return (

    <div className='border px-3 py-3 mb-3 row'>
        <div className='col-6'>
            <div>Current Block Number: {currentBlock?.number?.toString()}   </div>
            <div>Current Block Local Time: {currentBlock?.timestamp && dateFormatLocal(Number(currentBlock.timestamp)*1000)}</div>
            <div>Current Block GMT Time: {currentBlock?.timestamp && dateFormatUTC(Number(currentBlock.timestamp)*1000)}</div>
            <a className='btn btn-outline-secondary btn-sm mt-3' onClick={()=>{setCurrentBlock()}}>ReLoad</a>
        </div>
        <div className='col'>
            <span className='me-3'>Lottery block:</span> 
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="lotteryBlockType" id="inlineRadio0" value="0" defaultChecked onChange={(e)=>{
                    setNumberSelectType(e.target.value);
                    changeCycle(lotteryBlockCycleEl.current.value)
                }}/>
                <label className="form-check-label" htmlFor="inlineRadio0">By Cycle</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="lotteryBlockType" id="inlineRadio1" value="1" onChange={(e)=>{
                    setNumberSelectType(e.target.value)
                    changeNumber(lotteryBlockNumberEl.current.value)
                }}/>
                <label className="form-check-label" htmlFor="inlineRadio1">By BlockNumber</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="lotteryBlockType" id="inlineRadio2" value="2"  onChange={(e)=>{
                    setNumberSelectType(e.target.value)
                    changeTime(lotteryBlockNumberTimeEl.current.value)
                }}/>
                <label className="form-check-label" htmlFor="inlineRadio2">By Date</label>
            </div>
            <div className="my-2">
                <div className={numberSelectType == 0 ? 'd-block': 'd-none'}>
                    <select className='form-select' ref={lotteryBlockCycleEl} onChange={(e)=>{
                        changeCycle(e.target.value)
                    }}>
                        {currentBlock?.number && intiCycleOptions(currentBlock.number)}
                    </select>
                </div>            
                <div className={numberSelectType == 1 ? 'row': 'd-none'}>
                    <div className='col-8'>
                        <input type="number" className="form-control" ref={lotteryBlockNumberEl} min={currentBlock?.number ? Number(currentBlock?.number + nearestBlockCount) : ''} onChange={(e) => {
                            changeNumber(e.target.value)
                        }}/>
                    </div>
                    <div className="form-check pt-2 ms-3 col">
                        <input className="form-check-input" type="checkbox" id="toCycleForNumber" checked={isCycle} onChange={(e)=>{
                            setIsCycle(e.target.checked);
                            changeNumber(lotteryBlockNumberEl.current.value, e.target.checked)
                        }}/>
                        <label className="form-check-label" htmlFor="toCycleForNumber">To Cycle</label>
                    </div>
                </div>
                <div className={numberSelectType == 2 ? 'row': 'd-none'}>
                    <div className='col-8'>
                        <input type="datetime-local" className="form-control" ref={lotteryBlockNumberTimeEl} min={currentBlock?.number && dateFormatMid(getLotteryBlockTime(currentBlock.number + nearestBlockCount))} onChange={(e)=>{
                        changeTime(e.target.value)
                        }}/>
                    </div>
                    <div className="form-check pt-2 ms-3 col">
                        <input className="form-check-input" type="checkbox" id="toCycleForTime" checked={isCycle} onChange={(e)=>{
                            setIsCycle(e.target.checked)
                            changeTime(lotteryBlockNumberTimeEl.current.value, e.target.checked)
                        }}/>
                        <label className="form-check-label" htmlFor="toCycleForTime">To Cycle</label>
                    </div>
                </div>
            </div>
            <div>
                <div>Lottery Block Number: {lotteryBlockNumber.toString()}</div>
                <div>Local Time: {currentBlock?.number && dateFormatLocal(getLotteryBlockTime(lotteryBlockNumber))}</div>
                <div>GMT Time: {currentBlock?.number && dateFormatUTC(getLotteryBlockTime(lotteryBlockNumber))}</div>
            </div>

        </div>
    </div>

        
    )
}