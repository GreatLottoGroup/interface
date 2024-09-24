
import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import CallableABI from '@/abi/Callable.json'

import useWrite from '@/launch/hooks/write'

export default function useCallable() {

    const { address: accountAddress } = useAccount()
    const config = useConfig();

    const { write, error, isLoading, isSuccess, isPending } = useWrite()

    const transferCaller = async (addr, newCaller) => {
        console.log(addr, newCaller);
        let [tx, ] = await write({
            account: accountAddress,
            address: addr,
            abi: CallableABI,
            functionName: 'transferCaller',
            args: [newCaller]
        })
        return tx;
    }

    const getCallers = async (addr) => {
        const data = await readContract(config, {
            address: addr,
            abi: CallableABI,
            functionName: 'callers'
        })
        console.log(addr, data);
        return data;
    }

    return {
        transferCaller,
        getCallers,

        error,
        isLoading,
        isSuccess,
        isPending
    }

}