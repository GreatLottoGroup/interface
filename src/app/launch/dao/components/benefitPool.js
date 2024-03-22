'use client';

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatAmount } from '@/launch/hooks/globalVars'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'

export default function BenefitPool({poolBalance, setPoolBalance, useBenefit}) {

    const { address: accountAddress } = useAccount()

    const { getExecutorReward, executeBenefit, getPoolBalance, isLoading, isPending } = useBenefit()

    
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
    }, [accountAddress])

  return (
    <>
        <Card title="Benefit Pool" reload={getBenefitPoolBalance}>
            <p className="card-text mb-1">Balance: {formatAmount(poolBalance)} GLC</p>
            <p className="card-text mb-1">Executor Reward: {formatAmount(getExecutorReward(poolBalance))} GLC</p>
            {poolBalance && (
                <WriteBtn action={executeShareBenefit} isLoading={isLoading || isPending} className="mt-3">Share Benefit</WriteBtn>
            )}

        </Card>

    </>

  )
}

