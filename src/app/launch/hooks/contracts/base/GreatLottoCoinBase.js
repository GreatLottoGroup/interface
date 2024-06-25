

import { useAccount } from 'wagmi'

import GreatCoinABI from '@/abi/GreatLottoCoin'
import useWrite  from '@/launch/hooks/write';
import useCoin  from '@/launch/hooks/coin';

export default function useGreatLottoCoinBase(coinAddr) {

    const { address: accountAddress } = useAccount()
    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite();
    const coin = useCoin(coinAddr);

    const withdraw = async (token, amount) => {
        let tx = await write({
            account: accountAddress,
            address: coinAddr,
            abi: GreatCoinABI,
            functionName: 'withdraw',
            args: [token, amount],
        })
        return tx;
    }

    const recover = async () => {
        let tx = await write({
            account: accountAddress,
            address: coinAddr,
            abi: GreatCoinABI,
            functionName: 'recover'
        })
        return tx;    
    }

    return {
        withdraw,
        recover,

        ...coin,

        error,
        isLoading,
        isSuccess,
        isPending,
        isConfirm,
    }


}