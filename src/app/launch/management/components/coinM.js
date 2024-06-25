'use client';

import useGreatLottoCoinBase from '@/launch/hooks/contracts/base/GreatLottoCoinBase'
import useAddress from "@/launch/hooks/address"
import WriteBtn from '@/launch/components/writeBtn'

export default function CoinManagement({isEth, coinTotal, baseCoinTotalBalance}) {

    console.log('coinTotal: ', coinTotal);
    console.log('baseCoinTotalBalance: ', baseCoinTotalBalance);

    const { GreatCoinContractAddress, GreatEthContractAddress } = useAddress();
    const coinAddr = isEth ? GreatEthContractAddress : GreatCoinContractAddress;

    const { recover, isLoading, isPending } = useGreatLottoCoinBase(coinAddr)

    const recoverExecute = async () => {
        let tx = await recover();
        if(tx){
            getCoinsData()
        }
    }

  return (
    <>
        {coinTotal < baseCoinTotalBalance ? (
            <WriteBtn action={recoverExecute} isLoading={isLoading || isPending} className="mt-2"> Recover </WriteBtn>
        ) : (
            <button type="button" disabled={true} className='btn btn-primary mt-2' >No Need Recover</button>
        )}
    </>

  )
}

