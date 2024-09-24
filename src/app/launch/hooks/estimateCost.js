

import { useAccount, useConfig } from 'wagmi'
import { getPublicClient, readContract } from '@wagmi/core'
import  useWrite  from '@/launch/hooks/write';
import { errorHandle } from '@/launch/hooks/globalVars'
import ExecutorRewardABI from '@/abi/ExecutorReward.json'
import useEtherscan from '@/launch/hooks/etherscan'

export default function useEstimateCost() {

    const config = useConfig();
    const publicClient = getPublicClient(config);

    const { write, simulate, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()

    const { address: accountAddress } = useAccount()

    const { getEthPrice } = useEtherscan();

    const estimateGasByExecute = async (address, abi, functionName, args) => {
        const gas = await publicClient.estimateContractGas({
            account: accountAddress,
            address,
            abi,
            functionName,
            args,
        })
        return gas;
    }

    const getRewardGap = (reward, cost) => {
        if(reward > 0n && cost > 0n){
            return (Number(reward - cost) / Number(cost) * 100).toFixed(2);
        }else{
            return 0;
        }
    }

    const getGasPrice = async () => {

        /*console.log('gasPrice: ', await publicClient.getGasPrice())
        console.log('estimateFeesPerGas: ', await publicClient.estimateFeesPerGas())
        console.log('estimateMaxPriorityFeePerGas: ', await publicClient.estimateMaxPriorityFeePerGas())
        console.log('feeHistory: ',await publicClient.getFeeHistory({ 
            blockCount: 5,
            rewardPercentiles: [25, 75] 
        }))*/

        let gasPrice = await publicClient.getGasPrice();

        let {baseFeePerGas, reward} = await publicClient.getFeeHistory({ 
            blockCount: 1,
            rewardPercentiles: [75] 
        })

        let _gasPrice = baseFeePerGas[baseFeePerGas.length - 1] + reward[0][0];

        console.log('gasPrice: ', gasPrice, _gasPrice);

        return gasPrice > _gasPrice ? gasPrice : _gasPrice;
    }

    const getExecutorReward = async (address, abi, functionName, args, isEth) => {
        let [result, ] = await simulate({
            account: accountAddress,
            address: address,
            abi: abi,
            functionName: functionName,
            args: args,
        });

        console.log('simulate result: ', result);
        if(!result){
            return [0n, 0n, 0n];
        }
        let [_result, gasUsed] = result;

        let reward = 0n
        let gasGap = await getExecutorGasGap(address);
        let gasPrice = await getGasPrice();

        if(_result){
            console.log('gasUsed: ', gasUsed, gasGap, gasUsed + gasGap)
            reward = (gasUsed + gasGap) * gasPrice;
            if(!isEth){
                let rewardPrice = await getExecutorRewardPrice(address);
                console.log('rewardPrice: ', rewardPrice);
                reward = reward * rewardPrice;
            }
            console.log('ExecutorReward: ', reward, gasPrice)
        }

        return [reward, gasPrice, gasUsed + gasGap];           

    }

    const getExecutorCost = async(address, abi, functionName, args, isEth) => {
        let gasPrice = await getGasPrice();
        let gasCost = 0n;

        try {
            gasCost = await estimateGasByExecute(address, abi, functionName, args);
        } catch (err) {
            errorHandle(err);
        }
        console.log('gasCost: ', gasCost)
        let reward = gasCost * gasPrice;
        if(!isEth){
            let rewardPrice = (await getEthPrice())?.ethusd;
            console.log('rewardPrice: ', rewardPrice);
            reward = reward * BigInt(parseInt(Number(rewardPrice) * 10**10)) / 10n ** 10n;
        }
        console.log('ExecutorCost: ', reward, gasPrice)
        return [reward, gasPrice, gasCost];

    }

    const getExecutorRewardPrice = async (address) => {
        let data = await readContract(config, {
            address: address,
            abi: ExecutorRewardABI,
            functionName: 'executorRewardPrice'
        })
        return data;
    }

    const getExecutorGasGap = async (address) => {
        let data = await readContract(config, {
            address: address,
            abi: ExecutorRewardABI,
            functionName: 'executorGasGap'
        })
        return data;
    }
    
    const changeExecutorRewardPrice = async (address, price) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: address,
            abi: ExecutorRewardABI,
            functionName: 'changeExecutorRewardPrice',
            args: [price],
        })
        return tx;
    }

    const changeExecutorGasGap = async (address, gap) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: address,
            abi: ExecutorRewardABI,
            functionName: 'changeExecutorGasGap',
            args: [gap],
        })
        return tx;
    }
    
    return {
        estimateGasByExecute,
        getGasPrice,
        getExecutorReward,
        getExecutorGasGap,
        getExecutorRewardPrice,
        changeExecutorGasGap,
        changeExecutorRewardPrice,
        getExecutorCost,
        getRewardGap,

        error,
        isLoading,
        isSuccess,
        isPending,
        isConfirm,

    }

}