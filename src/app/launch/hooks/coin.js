
import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import { erc20Abi } from 'viem' 

import useWrite from './write'

export default function useCoin(coinAddr) {

    const { address: accountAddress } = useAccount()
    const config = useConfig();

    const { write, error, isLoading, isSuccess, isPending, isConfirm } = useWrite()

    const increaseAllowance = async (to, amount, addr, abi) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: addr || coinAddr,
            abi: abi ||erc20Abi,
            functionName: 'approve',
            args: [to, amount]
        })
        return tx;
    }


    const getAllowance = async (to, addr) => {
        const data = await readContract(config, {
            address: addr || coinAddr,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [accountAddress, to]
        })
        //console.log(data);
        return data;
    }

    const getBalance = async (owner, addr) => {
        const data = await readContract(config, {
            address: addr || coinAddr,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [owner || accountAddress]
        })
        return data;
    }   

    const totalSupply = async (addr) => {
        let data = await readContract(config, {
            address: addr || coinAddr,
            abi: erc20Abi,
            functionName: 'totalSupply'
        })
        return data;
    }

    return {
        getAllowance,
        increaseAllowance,
        getBalance,
        totalSupply,

        error,
        isLoading,
        isSuccess,
        isPending, 
        isConfirm
    }

}