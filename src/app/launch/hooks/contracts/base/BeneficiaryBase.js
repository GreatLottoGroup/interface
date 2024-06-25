

import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import { erc20Abi } from 'viem' 

import BeneficiaryBaseABI from '@/abi/BeneficiaryBase'

import { isOwner, ExecutorRewardSaveRate } from '@/launch/hooks/globalVars'

import useCoin from '@/launch/hooks/coin'

export default function useBeneficiaryBase(coinAddress, coinMaxSupply) {

    const config = useConfig();

    const { address: accountAddress } = useAccount()

    const { getBalance, totalSupply } = useCoin(coinAddress)

    const getBeneficiaryList = async () => {
        let data = await readContract(config, {
            address: coinAddress,
            abi: BeneficiaryBaseABI,
            functionName: 'getBeneficiaryList'
        })
        //console.log(data);
        return data;
    }

    const getBenefitRate = async (addr) => {
        let data = await readContract(config, {
            address: coinAddress,
            abi: BeneficiaryBaseABI,
            functionName: 'getBenefitRate',
            args: [addr || accountAddress]
        })
        return data;
    }

    const getDistributableShares = async () => {
        let total = await totalSupply();
        return coinMaxSupply - total
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

        let benefitAmount = poolBalance - poolBalance * ExecutorRewardSaveRate / 1000n
        let sumBenefit = 0n

        if(addressList.length > 0){
            for(let i = 0; i < addressList.length; i++){
                let balance = await getBalance(addressList[i]);
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
        //console.log(list)
        return list;
    }

    return {
        getBeneficiaryList, 
        getBenefitRate,
        getDistributableShares,
        getBenefitRateByBalance,
        getBenefitAmountByBalance,
        getBeneficiaryListData,
    }


}