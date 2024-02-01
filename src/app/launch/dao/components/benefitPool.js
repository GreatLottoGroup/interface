'use client';

import { useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { GreatCoinDecimals, formatAmount } from '@/launch/hooks/globalVars'

export default function BenefitPool({poolBalance, setPoolBalance, useBenefit}) {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const { getExecutorReward, executeBenefit, getPoolBalance, error, setError, isLoading, isSuccess } = useBenefit()

    
    const getBenefitPoolBalance = async () => {
        let balance = await getPoolBalance()
        setPoolBalance(balance)
        return balance;
    }

    const executeShareBenefit = async () => {
        let tx = await executeBenefit()
        if(tx){
            getBenefitPoolBalance()
        }
    }

    useEffect(()=>{

        console.log('useEffect~')
        getBenefitPoolBalance()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, publicClient])

  return (
    <>

        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">Benefit Pool:</h5>
                <p className="card-text mb-1">Balance: {formatAmount(poolBalance, GreatCoinDecimals)} GLC</p>
                <p className="card-text mb-1">Executor Reward: {formatAmount(getExecutorReward(poolBalance), GreatCoinDecimals)} GLC</p>
                {poolBalance && (
                    <button type="button" disabled={!!isLoading} className='btn btn-primary mt-3'  onClick={()=>{executeShareBenefit()}}> Share Benefit {isLoading ? '...' : ''}</button>
                )}
            </div>
        </div>

    </>

  )
}

