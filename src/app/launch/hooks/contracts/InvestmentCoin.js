import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import { InvestmentCoinMaxSupply, InvestmentExecutorRewardRate, formatAmount, parseAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import InvestmentCoinABI from '@/abi/InvestmentCoin.json'
import InvestmentBenefitPoolABI from '@/abi/InvestmentBenefitPool.json'
import useBenefitCoin from '../benefitCoin'

export default function useInvestmentCoin() {

    const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { InvestmentCoinContractAddress, InvestmentBenefitPoolContractAddress } = useAddress();
    
    const benefitCoin = useBenefitCoin(InvestmentCoinContractAddress, InvestmentBenefitPoolContractAddress, InvestmentCoinABI, InvestmentBenefitPoolABI, InvestmentCoinMaxSupply, InvestmentExecutorRewardRate)

    const maxDeposit = async () => {
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxDeposit',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const maxMint = async () => {
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxMint',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const maxWithdraw = async () => {
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxWithdraw',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const maxRedeem = async () => {
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'maxRedeem',
            args: [accountAddress]
        })
        return formatAmount(data);
    }

    const previewDeposit = async (assets) => {
        let _assets = parseAmount(assets)
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewDeposit',
            args: [_assets]
        })
        return formatAmount(data);
    }

    const previewMint = async (shares) => {
        let _shares = parseAmount(shares)
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewMint',
            args: [_shares]
        })
        return formatAmount(data);
    }

    const previewWithdraw = async (assets) => {
        let _assets = parseAmount(assets)
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewWithdraw',
            args: [_assets]
        })
        return formatAmount(data);
    }

    const previewRedeem = async (shares) => {
        let _shares = parseAmount(shares)
        let data = await readContract(config, {
            address: InvestmentCoinContractAddress,
            abi: InvestmentCoinABI,
            functionName: 'previewRedeem',
            args: [_shares]
        })
        return formatAmount(data);
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