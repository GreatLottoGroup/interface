

import { useAccount } from 'wagmi'

import { DaoCoinMaxSupply, DaoExecutorRewardRate } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import DaoCoinABI from '@/abi/DAOCoin.json'
import DaoBenefitPoolABI from '@/abi/DAOBenefitPool.json'
import useBenefitCoin from '../benefitCoin'
import useWrite  from '../write';

export default function useDaoCoin() {

    const { address: accountAddress } = useAccount()
    const { DaoCoinContractAddress, DaoBenefitPoolContractAddress } = useAddress();

    const benefitCoin = useBenefitCoin(DaoCoinContractAddress, DaoBenefitPoolContractAddress, DaoCoinABI, DaoBenefitPoolABI, DaoCoinMaxSupply, DaoExecutorRewardRate)
    const { write, error, setError, isLoading, isSuccess, isPending, isConfirm} = useWrite()

    const mint = async (account, amount) => {
        let tx = await write({
            account: accountAddress,
            address: DaoCoinContractAddress,
            abi: DaoCoinABI,
            functionName: 'mint',
            args: [account, amount],
        })
        return tx;
    }

    return {
        mint, 

        ...benefitCoin,

        error: benefitCoin.error || error,
        setError: function(){
            benefitCoin.setError();
            setError();
        },
        isLoading: benefitCoin.isLoading || isLoading,
        isSuccess: benefitCoin.isSuccess || isSuccess,
        isPending: benefitCoin.isPending || isPending,
        isConfirm: benefitCoin.isConfirm || isConfirm,

    }


}