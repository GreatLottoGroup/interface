
import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import CallableABI from '@/abi/Callable.json'

import useWrite from './write'

export default function useCallable() {

    const { address: accountAddress } = useAccount()
    const config = useConfig();

    const { write, error, setError, isLoading, isSuccess } = useWrite()

    const transferCaller = async (addr, newCaller) => {
        let tx = write({
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
        //console.log(data);
        return data;
    }

    return {
        transferCaller,
        getCallers,

        error,
        setError,
        isLoading,
        isSuccess
    }

}