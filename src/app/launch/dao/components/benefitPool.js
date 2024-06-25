'use client';

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { glc, gleth, eth, usd, rate } from "@/launch/components/coinShow"
import { parseAmount } from '@/launch/hooks/globalVars'
import useEstimateCost from '@/launch/hooks/estimateCost'


export default function BenefitPool({poolBalance, setPoolBalance, isEth, useBenefitPool}) {
    
    const minBenefitBalance = isEth ? parseAmount(10) : parseAmount(10000);

    const { address: accountAddress } = useAccount()

    const { getExecutorReward, executeBenefit, getPoolBalance, getExecutorCost, isLoading, isPending } = useBenefitPool();

    const { getRewardGap } = useEstimateCost()

    const [executorReward, setExecutorReward] = useState(0);
    const [executorCost, setExecutorCost] = useState(0);

    const getExecutorRewardInfo = async () => {
        console.log('isEth: ', isEth);
        let [reward, ] = await getExecutorReward(isEth);

        setExecutorReward(reward);

        let [cost, ] = await getExecutorCost(isEth)
        setExecutorCost(cost);

    }
    
    const getBenefitPoolBalance = async () => {
        let balance = await getPoolBalance(isEth);
        setPoolBalance(balance);
        // 获取分润执行奖金
        if(balance >= minBenefitBalance){
            await getExecutorRewardInfo()
        }
        return balance;
    }

    const executeShareBenefit = async () => {
        let tx = await executeBenefit(isEth)
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
        <Card title={"Benefit Pool with " + (isEth ? 'Eth Coin' : 'Standard Coin')} reload={getBenefitPoolBalance}>
            <p className="card-text mb-1">Balance: {isEth ? gleth(poolBalance) : glc(poolBalance)}</p>
            {poolBalance && poolBalance >= minBenefitBalance && (
                <>
                <p className="card-text mb-1">Executor Cost ≈ : {isEth ? eth(executorCost) : usd(executorCost)}</p>
                <p className="card-text mb-1">Executor Reward ≈ : {isEth ? gleth(executorReward) : glc(executorReward)} {rate('+ ' + getRewardGap(executorReward, executorCost))}</p>
                <WriteBtn action={executeShareBenefit} isLoading={isLoading || isPending} className="mt-3">Share Benefit</WriteBtn>
                </>
            )}
        </Card>
    </>

  )
}

