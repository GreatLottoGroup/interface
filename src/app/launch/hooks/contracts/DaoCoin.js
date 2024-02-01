

import { useAccount } from 'wagmi'

import { DaoCoinContractAddress, DaoBenefitPoolContractAddress, DaoCoinMaxSupply, DaoExecutorRewardRate } from '@/launch/hooks/globalVars'
import DaoCoinABI from '@/abi/DAOCoin.json'
import DaoBenefitPoolABI from '@/abi/DAOBenefitPool.json'
import useBenefitCoin from '../benefitCoin'
import useWrite  from '../write';

export default function useDaoCoin() {

    const { address: accountAddress } = useAccount()

    const benefitCoin = useBenefitCoin(DaoCoinContractAddress, DaoBenefitPoolContractAddress, DaoCoinABI, DaoBenefitPoolABI, DaoCoinMaxSupply, DaoExecutorRewardRate)
    const { write, error, setError, isLoading, isSuccess} = useWrite()

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

    }


}