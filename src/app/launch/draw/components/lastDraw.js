'use client';

import { useState, useEffect } from 'react'
import { DrawGroupBalls } from '@/launch/hooks/balls'
import { formatAmount, shortAddress } from '@/launch/hooks/globalVars'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import Card from '@/launch/components/card'

export default function DrawBlock({currentBlock}) {

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
    }, [currentBlock])

    return (
    <>

        <Card title="Last Draw" reload={getLastDrawBlock}>
            {drawBlock?.blockNumber ? (
                <>
                <p className='card-text mb-1'>Block Number: {drawBlock.blockNumber.toString()}</p>
                <p className="card-text mb-1">
                    DrawNumber: &nbsp;
                    <DrawGroupBalls drawNumbers={drawBlock.drawNumber} />
                </p>
                <p className='card-text mb-1'>Normal Award Sum Amount: {formatAmount(drawBlock.normalAwardSumAmount)} GLC</p>
                <p className='card-text mb-1'>Top Bonus Count: {drawBlock.topBonusMultiples || 0}</p>
                <p className='card-text mb-1'>Top Bonus Sum Amount: {formatAmount(drawBlock.topBonusSumAmount)} GLC</p>
                <p className='card-text mb-1'>Benefit Rate: {Number(drawBlock.benefitRate)/10}%</p>
                <p className='card-text mb-1'>Benefit Amount: {formatAmount(drawBlock.benefitAmount)} GLC</p>
                <p className='card-text mb-1'>Current Rollup Prize: {formatAmount(drawBlock.rollupBalance)} GLC</p>
                <p className='card-text'>Opener: {shortAddress(drawBlock.opener)}</p>
                </>
            ) : (
                <p className='card-text'>No Last Draw Block</p>
            )}

        </Card>

    </>

    )
}

