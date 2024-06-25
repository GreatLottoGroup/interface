import useAddress from "@/launch/hooks/address"

import useInvestmentCoinBase from './base/InvestmentCoinBase'

export default function useInvestmentEth() {

    const { InvestmentEthContractAddress } = useAddress();

    const investmentCoinBase = useInvestmentCoinBase(InvestmentEthContractAddress)

    return {
        ...investmentCoinBase,

    }


}