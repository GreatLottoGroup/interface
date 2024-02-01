'use client';

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { DrawGroupBalls } from '@/launch/hooks/balls'
import { formatAmount, GreatCoinDecimals, shortAddress } from '@/launch/hooks/globalVars'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'

export default function DrawBlock({currentBlock}) {

    const publicClient = usePublicClient()

    const [drawBlock, setDrawBlock] = useState({})

    const { getBlockDrawStatus, getRecentDrawBlockNumber, getRollupBalance } = usePrizePool()

    const getLastDrawBlock = async () => {
        let blockNumber = await getRecentDrawBlockNumber();
        if(blockNumber > 0n){
            let drawStatus = await getBlockDrawStatus(blockNumber);
            let rollupBalance = await getRollupBalance()
            console.log(drawStatus)
            setDrawBlock({
                blockNumber,
                rollupBalance,
                ...drawStatus,
            })
        }else{
            setDrawBlock({});
        }
    }

    useEffect(()=>{

        console.log('useEffect~')
        getLastDrawBlock()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicClient, currentBlock])

    return (
    <>


        <div className="card" >
            <div className="card-body position-relative">
                <a className="btn btn-sm btn-outline-secondary position-absolute end-0 me-3" onClick={()=>{getLastDrawBlock();}}>ReLoad</a>
                <h5 className="card-title">Last Draw: </h5>
                {drawBlock?.blockNumber ? (
                    <>
                    <p className='card-text mb-1'>Block Number: {drawBlock.blockNumber.toString()}</p>
                    <p className="card-text mb-1">
                        DrawNumber: &nbsp;
                        <DrawGroupBalls drawNumbers={drawBlock.drawNumber} />
                    </p>
                    <p className='card-text mb-1'>Nomal Award Sum Amount: {formatAmount(drawBlock.nomalAwardSumAmount, GreatCoinDecimals)} GLC</p>
                    <p className='card-text mb-1'>Top Bouns Count: {drawBlock.topBonusMultiples || 0}</p>
                    <p className='card-text mb-1'>Top Bonus Sum Amount: {formatAmount(drawBlock.topBonusSumAmount, GreatCoinDecimals)} GLC</p>
                    <p className='card-text mb-1'>Benefit Rate: {Number(drawBlock.benefitRate)/10}%</p>
                    <p className='card-text mb-1'>Benefit Amount: {formatAmount(drawBlock.benefitAmount, GreatCoinDecimals)} GLC</p>
                    <p className='card-text mb-1'>Current Rollup Prize: {formatAmount(drawBlock.rollupBalance, GreatCoinDecimals)} GLC</p>
                    <p className='card-text'>Opener: {shortAddress(drawBlock.opener)}</p>
                    </>
                ) : (
                    <p className='card-text'>No Last Draw Block</p>
                )}

            </div>
        </div>


    </>

    )
}

