

import { useAccount } from 'wagmi'

import useAddress from "@/launch/hooks/address"

import GreatEthABI from '@/abi/GreatLottoEth'
import useWrite  from '@/launch/hooks/write';
import useGreatLottoCoinBase  from './base/GreatLottoCoinBase';

export default function useGreatLottoEth() {

    const { address: accountAddress } = useAccount()
    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()

    const { GreatEthContractAddress } = useAddress()

    const coinBase = useGreatLottoCoinBase(GreatEthContractAddress)

    const wrap = async (amount) => {
        let tx = await write({
            account: accountAddress,
            address: GreatEthContractAddress,
            abi: GreatEthABI,
            functionName: 'wrap',
            args: [],
            value: amount
        });
        return tx;
    }

    const unwrap = async (amount) => {
        let tx = await write({
            account: accountAddress,
            address: GreatEthContractAddress,
            abi: GreatEthABI,
            functionName: 'unwrap',
            args: [amount]
        });
        return tx;
    }

    return {
        wrap,
        unwrap,

        ...coinBase,

        error: error || coinBase.error,
        isLoading: isLoading || coinBase.isLoading,
        isSuccess: isSuccess || coinBase.isSuccess,
        isPending: isPending || coinBase.isPending,
        isConfirm: isConfirm || coinBase.isConfirm,

    }


}