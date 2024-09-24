

import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import { DaoCoinMaxSupply } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import DaoCoinABI from '@/abi/DAOCoin.json'
import useBeneficiaryBase from './base/BeneficiaryBase'
import useWrite  from '@/launch/hooks/write';
import useCoin  from '@/launch/hooks/coin';

export default function useDaoCoin() {

    const { address: accountAddress } = useAccount()
    const { DaoCoinContractAddress } = useAddress();

    const config = useConfig();
    const beneficiaryBase = useBeneficiaryBase(DaoCoinContractAddress, DaoCoinMaxSupply)
    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const coin = useCoin(DaoCoinContractAddress);

    const mint = async (account, amount) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: DaoCoinContractAddress,
            abi: DaoCoinABI,
            functionName: 'mint',
            args: [account, amount],
        })
        return tx;
    }

    const getMintShares = async (assets, isEth) => {
        let data = await readContract(config, {
            address: DaoCoinContractAddress,
            abi: DaoCoinABI,
            functionName: 'getMintShares',
            args: [assets, isEth]
        })
        return data;
    }

    const getInitialPrice = async (isEth) => {
        let data = await readContract(config, {
            address: DaoCoinContractAddress,
            abi: DaoCoinABI,
            functionName: isEth ? 'initialPriceEth' : 'initialPrice'
        })
        return data;
    }

    const changeInitialPrice = async (price, isEth) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: DaoCoinContractAddress,
            abi: DaoCoinABI,
            functionName: 'changeInitialPrice',
            args: [price, isEth],
        })
        return tx;
    }

    return {
        mint, 
        getMintShares,
        changeInitialPrice,
        getInitialPrice,

        ...beneficiaryBase,
        
        ...coin,

        error,
        isLoading,
        isSuccess,
        isPending,
        isConfirm,

    }


}