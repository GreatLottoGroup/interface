import useAddress from "@/launch/hooks/address"

import useInvestmentCoinBase from './base/InvestmentCoinBase'

export default function useInvestmentCoin() {

    const { InvestmentCoinContractAddress } = useAddress();

    const investmentCoinBase = useInvestmentCoinBase(InvestmentCoinContractAddress)


    return {
        ...investmentCoinBase,

    }


}