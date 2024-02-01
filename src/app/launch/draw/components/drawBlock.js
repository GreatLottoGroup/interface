'use client';

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { GreatCoinDecimals } from '@/launch/hooks/globalVars'
import { formatUnits } from 'viem'

import { DrawGroupBalls } from '@/launch/hooks/balls'

import { getBenefit, getBenefitRate} from '@/launch/hooks/drawNumbers'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'

export default function DrawBlock({setCurrentBlock}) {

    const publicClient = usePublicClient()

    const [drawBlock, setDrawBlock] = useState({})
    const [isDrawBlockLoading, setIsDrawBlockLoading] = useState(false)


    const { findFirstDrawBlock, draw, error, setError, isLoading, isSuccess } = useGreatLotto()
    const { getBlockBalance, getRollupBalance } = usePrizePool()


    const getDrawBlock = async () => {
        setIsDrawBlockLoading(true)

        let curBlockNumber = await publicClient.getBlockNumber()

        let [blockNumber, drawNumber, nomalAwardSumAmount, topBonusMultiples] = await findFirstDrawBlock();

        console.log(blockNumber, drawNumber, nomalAwardSumAmount, topBonusMultiples)

        if(blockNumber > 0n){
            let blockBalance = await getBlockBalance(blockNumber);
            let rollupBalance = await getRollupBalance()

            let benefitRate = getBenefitRate(curBlockNumber, blockNumber);
            let benefit = getBenefit(benefitRate, blockBalance);

            setDrawBlock({
                curBlockNumber, 
                blockNumber,
                drawNumber, 
                nomalAwardSumAmount,
                topBonusMultiples,
                blockBalance: formatUnits(blockBalance, GreatCoinDecimals),
                rollupBalance: formatUnits(rollupBalance + blockBalance - benefit, GreatCoinDecimals) - Number(nomalAwardSumAmount),
                benefitRate,
                benefit: formatUnits(benefit, GreatCoinDecimals),
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
    }, [publicClient])

    return (
    <>


        <div className="card" >
            <div className="card-body position-relative">
                <a className="btn btn-sm btn-outline-secondary position-absolute end-0 me-3" onClick={()=>{getDrawBlock();}}>ReLoad</a>
                <h5 className="card-title">Draw Ticket: </h5>
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
                    <p className='card-text mb-1'>Nomal Award Sum Amount: {drawBlock.nomalAwardSumAmount.toString()} GLC</p>
                    <p className='card-text mb-1'>Top Bouns Count: {drawBlock.topBonusMultiples || 0}</p>
                    <p className='card-text mb-1'>Block Prize: {drawBlock.blockBalance || 0} GLC</p>
                    <p className='card-text mb-1'>Rollup Prize: {drawBlock.rollupBalance} GLC</p>
                    <p className='card-text mb-1'>Benefit Rate: {Number(drawBlock.benefitRate)/10}%</p>
                    <p className='card-text'>Benefit Amount: {drawBlock.benefit} GLC</p>
                    <button type="button" disabled={!!isLoading} className='btn btn-primary'  onClick={()=>{drawExecute()}}> DRAW {isLoading ? '...' : ''}</button>
                </>
            ) : (
                <p className='card-text'>No Block</p>
            ))}

            </div>
        </div>


    </>

    )
}

