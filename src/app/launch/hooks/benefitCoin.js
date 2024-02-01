

import { useAccount, usePublicClient, erc20ABI } from 'wagmi'

import {  getDeadline, isOwner, GreatCoinContractAddress } from '@/launch/hooks/globalVars'

import useCoin from '@/launch/hooks/coin'
import  useWrite  from './write';

export default function useBenefitCoin(coinAddress, poolAddress, coinAbi, poolAbi, coinMaxSupply, executorRewardRate) {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const { write, error, setError, isLoading, isSuccess} = useWrite()

    const { getBalance } = useCoin()

    const getBeneficiaryList = async () => {
        let data = await publicClient.readContract({
            address: coinAddress,
            abi: coinAbi,
            functionName: 'getBeneficiaryList'
        })
        console.log(data);
        return data;
    }

    const getBenefitRate = async (addr) => {
        let data = await publicClient.readContract({
            address: coinAddress,
            abi: coinAbi,
            functionName: 'getBenefitRate',
            args: [addr || accountAddress]
        })
        return data;
    }

    const executeBenefit = async () => {
        let tx = await write({
            account: accountAddress,
            address: poolAddress,
            abi: poolAbi,
            functionName: 'executeBenefit',
            args: [getDeadline()],
        })
        return tx;
    }

    const totalSupply = async () => {
        let data = await publicClient.readContract({
            address: coinAddress,
            abi: erc20ABI,
            functionName: 'totalSupply'
        })
        return data;
    }

    const getDistributableShares = async () => {
        let total = await totalSupply();
        return coinMaxSupply - total
    }

    const getExecutorReward = (balance) => {
        if(balance){
            return balance * executorRewardRate / 1000n
        }else{
            return 0n;
        }
    }

    const getBenefitRateByBalance = (balance) => {
        if(balance && balance > 10000){
            return balance * 10n ** 8n / coinMaxSupply;
        }else{
            return 0n;
        }
    }

    const getBenefitAmountByBalance = (balance, totalAmount) => {
        if(balance && balance > 10000){
            return balance * totalAmount / coinMaxSupply;
        }else{
            return 0n;
        }
    }

    const getBeneficiaryListData = async (poolBalance, finalBenefitAddress) => {
        let addressList = await getBeneficiaryList();
        let list = [];

        let executorReward = getExecutorReward(poolBalance)
        let benefitAmount = poolBalance - executorReward
        let sumBenefit = 0n

        if(addressList.length > 0){
            for(let i = 0; i < addressList.length; i++){
                let balance = await getBalance(coinAddress, addressList[i]);
                let rate = getBenefitRateByBalance(balance);

                let amount = 0n;
                if(benefitAmount > 0n){
                    amount = getBenefitAmountByBalance(balance, benefitAmount)
                    sumBenefit += amount
                }

                list.push({
                    address: addressList[i],
                    rate,
                    amount,
                    isFinal: false
                })
            }
        }

        if(isOwner(accountAddress)){
            list.push({
                address: finalBenefitAddress,
                rate: 0n,
                amount: benefitAmount - sumBenefit,
                isFinal: true
            })
        }        
        console.log(list)
        return list;
    }

    const getPoolBalance = async () => {
        let balance = await getBalance(GreatCoinContractAddress, poolAddress)
        return balance;
    }

    return {
        executeBenefit, 
        getBeneficiaryList, 
        getBenefitRate,
        totalSupply,
        getDistributableShares,
        getExecutorReward,
        getBenefitRateByBalance,
        getBenefitAmountByBalance,
        getBeneficiaryListData,
        getPoolBalance,

        error,
        setError,
        isLoading,
        isSuccess,
    }


}