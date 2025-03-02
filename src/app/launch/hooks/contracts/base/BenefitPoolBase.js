

import { useAccount } from 'wagmi'

import useAddress from "@/launch/hooks/address"
import useDeadline from '@/launch/hooks/deadline'

import useCoin from '@/launch/hooks/coin'
import useWrite  from '@/launch/hooks/write';
import useEstimateCost from '@/launch/hooks/estimateCost'
import BenefitPoolBaseABI from '@/abi/BenefitPoolBase.json'

export default function useBenefitPoolBase(poolAddress) {

    const { address: accountAddress } = useAccount()
    const { GreatCoinContractAddress, GreatEthContractAddress } = useAddress();
    const { getDeadline } = useDeadline();

    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()

    const { getBalance } = useCoin()

    const { getExecutorReward: _getExecutorReward, getExecutorCost: _getExecutorCost } = useEstimateCost()

    const executeBenefit = async (isEth, gas) => {
        gas = BigInt(gas);
        let [tx, ] = await write({
            account: accountAddress,
            address: poolAddress,
            abi: BenefitPoolBaseABI,
            functionName: 'executeBenefit',
            args: [isEth, await getDeadline()],
            // 增加 20%
            gas: gas + gas / 5n

        })
        return tx;
    }

    const getExecutorReward = async (isEth) => {
        return await _getExecutorReward(poolAddress, BenefitPoolBaseABI, 'executeBenefit', [isEth, await getDeadline()], isEth);
    }
    
    const getExecutorCost = async (isEth) => {
        return await _getExecutorCost(poolAddress, BenefitPoolBaseABI, 'executeBenefit', [isEth, await getDeadline()], isEth);
    }

    const getPoolBalance = async (isEth) => {
        let balance = await getBalance(poolAddress, isEth ? GreatEthContractAddress : GreatCoinContractAddress)
        return balance;
    }

    return {
        executeBenefit, 
        getExecutorReward,
        getExecutorCost,
        getPoolBalance,

        error,
        isLoading,
        isSuccess,
        isPending,
        isConfirm
    }


}