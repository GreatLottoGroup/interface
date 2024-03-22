

import { useAccount } from 'wagmi'

import useAddress from "@/launch/hooks/address"

import GreatCoinABI from '@/abi/GreatLottoCoin'
import  useWrite  from '../write';

export default function useGreatLottoCoin() {

    const { address: accountAddress } = useAccount()
    const { write, error, setError, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const { GreatCoinContractAddress } = useAddress();

    const withdrawTo = async (token, amount) => {
        let tx = await write({
            account: accountAddress,
            address: GreatCoinContractAddress,
            abi: GreatCoinABI,
            functionName: 'withdrawTo',
            args: [token, amount],
        })
        return tx;
    }

    const recover = async () => {
        let tx = await write({
            account: accountAddress,
            address: GreatCoinContractAddress,
            abi: GreatCoinABI,
            functionName: 'recover'
        })
        return tx;    
    }

    return {
        withdrawTo,
        recover,

        error,
        setError,
        isLoading,
        isSuccess,
        isPending,
        isConfirm,
    }


}