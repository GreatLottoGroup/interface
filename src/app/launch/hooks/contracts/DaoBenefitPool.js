import useAddress from "@/launch/hooks/address"
import useBenefitPoolBase from './base/BenefitPoolBase'

export default function useDaoBenefitPool() {

    const { DaoBenefitPoolContractAddress } = useAddress();

    const benefitPoolBase = useBenefitPoolBase(DaoBenefitPoolContractAddress)

    return {
        ...benefitPoolBase,

    }


}