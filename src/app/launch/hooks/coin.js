
import { useAccount, usePublicClient, erc20ABI } from 'wagmi'

import useWrite from './write'

export default function useCoin() {

    const { address: accountAddress } = useAccount()
    const publicClient = usePublicClient()

    const { write, error, setError, isLoading, isSuccess } = useWrite()

    const increaseAllowance = async (addr, to, amount, abi) => {
        let tx = write({
            account: accountAddress,
            address: addr,
            abi: abi || erc20ABI,
            functionName: 'approve',
            args: [to, amount]
        })
        return tx;
    }


    const getAllowance = async (addr, to) => {
        const data = await publicClient.readContract({
            address: addr,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [accountAddress, to]
        })
        //console.log(data);
        return data;
    }

    const getBalance = async (addr, owner) => {
        const data = await publicClient.readContract({
            address: addr,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [owner || accountAddress]
        })
        return data;
    }   

    const totalSupply = async (addr) => {
        let data = await publicClient.readContract({
            address: addr,
            abi: erc20ABI,
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
        isSuccess
    }

}