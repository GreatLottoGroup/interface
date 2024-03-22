
import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import { erc20Abi } from 'viem' 

import useWrite from './write'

export default function useCoin() {

    const { address: accountAddress } = useAccount()
    const config = useConfig();

    const { write, error, setError, isLoading, isSuccess, isPending, isConfirm } = useWrite()

    const increaseAllowance = async (addr, to, amount) => {
        let tx = write({
            account: accountAddress,
            address: addr,
            abi: erc20Abi,
            functionName: 'approve',
            args: [to, amount]
        })
        return tx;
    }


    const getAllowance = async (addr, to) => {
        const data = await readContract(config, {
            address: addr,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [accountAddress, to]
        })
        //console.log(data);
        return data;
    }

    const getBalance = async (addr, owner) => {
        const data = await readContract(config, {
            address: addr,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [owner || accountAddress]
        })
        return data;
    }   

    const totalSupply = async (addr) => {
        let data = await readContract(config, {
            address: addr,
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
        setError,
        isLoading,
        isSuccess,
        isPending, 
        isConfirm
    }

}