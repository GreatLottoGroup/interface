import useAddress from "@/launch/hooks/address"
import useBenefitPoolBase from './base/BenefitPoolBase'

export default function useInvestmentBenefitPool() {

    const { InvestmentBenefitPoolContractAddress } = useAddress();

    const benefitPoolBase = useBenefitPoolBase(InvestmentBenefitPoolContractAddress)

    return {
        ...benefitPoolBase,

    }


}