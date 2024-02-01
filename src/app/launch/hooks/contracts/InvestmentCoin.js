import { useAccount, usePublicClient } from 'wagmi'

import { InvestmentCoinContractAddress, InvestmentBenefitPoolContractAddress, InvestmentCoinMaxSupply, InvestmentExecutorRewardRate, formatAmount, parseAmount, GreatCoinDecimals, InvestmentCoinDecimals } from '@/launch/hooks/globalVars'
import InvestmentCoinABI from '@/abi/InvestmentCoin.json'
import InvestmentBenefitPoolABI from '@/abi/InvestmentBenefitPool.json'
import useBenefitCoin from '../benefitCoin'

export default function useInvestmentCoin() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()
    
    const benefitCoin = useBenefitCoin(InvestmentCoinContractAddress, InvestmentBenefitPoolContractAddress, InvestmentCoinABI, InvestmentBenefitPoolABI, InvestmentCoinMaxSupply, InvestmentExecutorRewardRate)

    const maxDeposit = async () => {
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxDeposit',
            args: [accountAddress]
        })
        return formatAmount(data, GreatCoinDecimals);
    }

    const maxMint = async () => {
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxMint',
            args: [accountAddress]
        })
        return formatAmount(data, InvestmentCoinDecimals);
    }

    const maxWithdraw = async () => {
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxWithdraw',
            args: [accountAddress]
        })
        return formatAmount(data, GreatCoinDecimals);
    }

    const maxRedeem = async () => {
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxRedeem',
            args: [accountAddress]
        })
        return formatAmount(data, InvestmentCoinDecimals);
    }

    const previewDeposit = async (assets) => {
        let _assets = parseAmount(assets, GreatCoinDecimals)
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewDeposit',
            args: [_assets]
        })
        return formatAmount(data, InvestmentCoinDecimals);
    }

    const previewMint = async (shares) => {
        let _shares = parseAmount(shares, InvestmentCoinDecimals)
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewMint',
            args: [_shares]
        })
        return formatAmount(data, GreatCoinDecimals);
    }

    const previewWithdraw = async (assets) => {
        let _assets = parseAmount(assets, GreatCoinDecimals)
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewWithdraw',
            args: [_assets]
        })
        return formatAmount(data, InvestmentCoinDecimals);
    }

    const previewRedeem = async (shares) => {
        let _shares = parseAmount(shares, InvestmentCoinDecimals)
        let data = await publicClient.readContract({
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewRedeem',
            args: [_shares]
        })
        return formatAmount(data, GreatCoinDecimals);
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

        ...benefitCoin
    }


}