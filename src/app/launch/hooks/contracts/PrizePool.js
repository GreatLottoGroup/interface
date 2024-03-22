

import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import  useWrite  from '../write';
import  usePermit  from '../permit'
import { getDeadline, parseAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import PrizePoolABI from '@/abi/PrizePool.json'

export default function usePrizePool() {

    const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { write, error, setError, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const permit = usePermit();
    const { PrizePoolContractAddress, GreatCoinContractAddress, getTokenDecimals } = useAddress();

    const getBlockDrawStatus = async (blockNumber) => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getBlockDrawStatus',
            args: [blockNumber]
        })
        //console.log(data)
        return data;
    }

    const getBlockBalance = async (blockNumber) => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getBlockBalance',
            args: [blockNumber]
        })
        //console.log(data)
        return data;
    }

    const getRollupBalance = async () => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getRollupBalance'
        })
        //console.log(data)
        return data;
    }

    const getRecentDrawBlockNumber = async () => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getRecentDrawBlockNumber'
        })
        //console.log(data)
        return data;
    }

    // Investment

    const investmentDeposit = async (token, amount) => {
        
        let tx = await write({
            account: accountAddress,
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'investmentDeposit',
            args: [token, amount, getDeadline()],
        })

        return tx;
    }
    
    const investmentDepositWithSign = async (token, amount) => {

        let deadline = getDeadline();

        let sign = permit.getSignMessage(token, GreatCoinContractAddress, parseAmount(amount, getTokenDecimals(token)), deadline)

        if(!sign){
            return false;
        }

        let tx = await write({
            account: accountAddress,
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'investmentDeposit',
            args: [token, amount, deadline, sign.v, sign.r, sign.s],
        })

        return tx;

    }

    const investmentRedeem = async (shares) => {

        let tx = await write({
            account: accountAddress,
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'investmentRedeem',
            args: [shares, getDeadline()],
        })

        return tx;

    } 


    return {

        getBlockDrawStatus,
        getBlockBalance,
        getRollupBalance,
        getRecentDrawBlockNumber,

        investmentDeposit,
        investmentDepositWithSign,
        investmentRedeem,

        error: error || permit.error,
        setError: function(){
            setError();
            permit.setError();
        },
        isLoading: isLoading || permit.isLoading,
        isSuccess: isSuccess || permit.isSuccess,
        isPending,
        isConfirm,
    }


}