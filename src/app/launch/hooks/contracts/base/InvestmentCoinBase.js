import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import { formatAmount, parseAmount, InvestmentCoinMaxSupply } from '@/launch/hooks/globalVars'
import InvestmentCoinBaseABI from '@/abi/InvestmentCoinBase.json'
import useWrite  from '@/launch/hooks/write';
import useCoin  from '@/launch/hooks/coin';
import useBeneficiaryBase from './BeneficiaryBase'

export default function useInvestmentCoinBase(coinAddr) {

    const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const coin = useCoin(coinAddr);

    const beneficiaryBase = useBeneficiaryBase(coinAddr, InvestmentCoinMaxSupply)

    const maxDeposit = async () => {
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'maxDeposit',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const maxMint = async () => {
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'maxMint',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const maxWithdraw = async () => {
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'maxWithdraw',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const maxRedeem = async () => {
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'maxRedeem',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const previewDeposit = async (assets) => {
        let _assets = parseAmount(assets)
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'previewDeposit',
            args: [_assets]
        })
        return formatAmount(data);
    }

    const previewMint = async (shares) => {
        let _shares = parseAmount(shares)
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'previewMint',
            args: [_shares]
        })
        return formatAmount(data);
    }

    const previewWithdraw = async (assets) => {
        let _assets = parseAmount(assets)
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'previewWithdraw',
            args: [_assets]
        })
        return formatAmount(data);
    }

    const previewRedeem = async (shares) => {
        let _shares = parseAmount(shares)
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'previewRedeem',
            args: [_shares]
        })
        return formatAmount(data);
    }

    const getInitialPrice = async () => {
        let data = await readContract(config, {
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'initialPrice'
        })
        return data;
    }

    const changeInitialPrice = async (price) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: coinAddr,
            abi: InvestmentCoinBaseABI,
            functionName: 'changeInitialPrice',
            args: [price],
        })
        return tx;
    }

    return {
        maxDeposit,
        maxMint,
        maxRedeem,
        maxWithdraw,

        previewDeposit,
        previewMint,
        previewRedeem,
        previewWithdraw,
        
        getInitialPrice,
        changeInitialPrice,

        ...beneficiaryBase, 

        ...coin,

        error,
        isLoading,
        isSuccess,
        isPending,
        isConfirm
    }


}