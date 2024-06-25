import useAddress from "@/launch/hooks/address"
import useGreatLottoCoinBase  from './base/GreatLottoCoinBase';

export default function useGreatLottoCoin() {


    const { GreatCoinContractAddress } = useAddress()

    const coinBase = useGreatLottoCoinBase(GreatCoinContractAddress)

    return {
        ...coinBase,
    }


}