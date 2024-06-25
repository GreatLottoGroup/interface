import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import  useWrite  from '@/launch/hooks/write';
import  usePermit  from '@/launch/hooks/permit'
import { parseAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import useDeadline from '@/launch/hooks/deadline'

import PrizePoolABI from '@/abi/PrizePool.json'

export default function usePrizePool() {

    const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const permit = usePermit();
    const { PrizePoolContractAddress, getTokenDecimals, getApproveSpender, getIsEthCoin } = useAddress();
    const { getDeadline } = useDeadline();

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

    const getBlockBalance = async (blockNumber, isEth) => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getBlockBalance',
            args: [blockNumber, isEth]
        })
        //console.log(data)
        return data;
    }

    const getBlockCount = async () => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getBlockCount'
        })
        //console.log(data)
        return data;
    }

    const getBlockByIndex = async (index) => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getBlockByIndex',
            args: [index]
        })
        //console.log(data)
        return data;
    }
    const getRollupBalance = async (isEth) => {
        let data = await readContract(config, {
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'getRollupBalance',
            args: [isEth]
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
        let isEth = getIsEthCoin(token);

        if(isEth){
            amount = parseAmount(amount, getTokenDecimals(token));
        }
        console.log('amount:', amount)
        let tx = await write({
            account: accountAddress,
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'investmentDeposit',
            args: [token, amount, await getDeadline()],
        })

        return tx;
    }
    
    const investmentDepositWithSign = async (token, amount) => {

        let deadline = await getDeadline();

        let _amount = parseAmount(amount, getTokenDecimals(token))
        
        let isEth = getIsEthCoin(token);

        if(isEth){
            amount = _amount;
        }

        let sign = await permit.getSignMessage(token, getApproveSpender(token), _amount, deadline)

        if(!sign){
            return false;
        }

        let tx = await write({
            account: accountAddress,
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'investmentDepositWithSign',
            args: [token, amount, deadline, sign.v, sign.r, sign.s],
        })

        return tx;

    }

    const investmentRedeem = async (token, shares) => {
        let tx = await write({
            account: accountAddress,
            address: PrizePoolContractAddress,
            abi: PrizePoolABI,
            functionName: 'investmentRedeem',
            args: [shares, token, await getDeadline()],
        })

        return tx;

    } 


    return {

        getBlockDrawStatus,
        getBlockBalance,
        getRollupBalance,
        getRecentDrawBlockNumber,
        getBlockCount,
        getBlockByIndex,

        investmentDeposit,
        investmentDepositWithSign,
        investmentRedeem,

        error: error || permit.error,
        isLoading: isLoading || permit.isLoading,
        isSuccess: isSuccess || permit.isSuccess,
        isPending,
        isConfirm,
    }


}