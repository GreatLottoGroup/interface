'use client';

import { useState, useEffect } from 'react'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import { formatAmount } from '@/launch/hooks/globalVars'

import { DrawGroupBalls } from '@/launch/hooks/balls'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'

import { getBenefit, getBenefitRate} from '@/launch/hooks/drawNumbers'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'

export default function DrawBlock({setCurrentBlock}) {

    const config = useConfig();

    const [drawBlock, setDrawBlock] = useState({})
    const [isDrawBlockLoading, setIsDrawBlockLoading] = useState(false)


    const { findFirstDrawBlock, draw, isLoading, isPending } = useGreatLotto()
    const { getBlockBalance, getRollupBalance } = usePrizePool()


    const getDrawBlock = async () => {
        setIsDrawBlockLoading(true)

        let curBlockNumber = await getBlockNumber(config)

        let [blockNumber, drawNumber, normalAwardSumAmount, topBonusMultiples] = await findFirstDrawBlock();

        console.log(blockNumber, drawNumber, normalAwardSumAmount, topBonusMultiples)

        if(blockNumber > 0n){
            let blockBalance = await getBlockBalance(blockNumber);
            let rollupBalance = await getRollupBalance()

            let benefitRate = getBenefitRate(curBlockNumber, blockNumber);
            let benefit = getBenefit(benefitRate, blockBalance);

            setDrawBlock({
                curBlockNumber, 
                blockNumber,
                drawNumber, 
                normalAwardSumAmount,
                topBonusMultiples,
                blockBalance: formatAmount(blockBalance),
                rollupBalance: formatAmount(rollupBalance + blockBalance - benefit) - Number(normalAwardSumAmount),
                benefitRate,
                benefit: formatAmount(benefit),
            })
        }else{
            setDrawBlock({});
        }

        setIsDrawBlockLoading(false)
    }

    const drawExecute = async () =>{

        let tx = await draw();

        if(tx){
            await getDrawBlock()
            setCurrentBlock()
        }else{
            console.log('error---');
        }

    }


    useEffect(()=>{

        console.log('useEffect~')
        getDrawBlock()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
    <>

        <Card title="Draw Ticket" reload={getDrawBlock}>
            {isDrawBlockLoading ? (
                    <p className='card-text'>Loading...
                        <span className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </span>          
                    </p>
            ) : (drawBlock.blockNumber ? (
                <>
                    <p className='card-text mb-1'>Block Number: {drawBlock.blockNumber.toString()}</p>
                    <p className="card-text mb-1">
                        DrawNumber: &nbsp;
                        <DrawGroupBalls drawNumbers={drawBlock.drawNumber} />
                    </p>
                    <p className='card-text mb-1'>Normal Award Sum Amount: {drawBlock.normalAwardSumAmount.toString()} GLC</p>
                    <p className='card-text mb-1'>Top Bonus Count: {drawBlock.topBonusMultiples || 0}</p>
                    <p className='card-text mb-1'>Block Prize: {drawBlock.blockBalance || 0} GLC</p>
                    <p className='card-text mb-1'>Rollup Prize: {drawBlock.rollupBalance} GLC</p>
                    <p className='card-text mb-1'>Benefit Rate: {Number(drawBlock.benefitRate)/10}%</p>
                    <p className='card-text'>Benefit Amount: {drawBlock.benefit} GLC</p>

                    <WriteBtn action={drawExecute} isLoading={isLoading || isPending} >DRAW</WriteBtn>

                </>
            ) : (
                <p className='card-text'>No Block</p>
            ))}

        </Card>

    </>

    )
}

