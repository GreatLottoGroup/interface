'use client';

import useGreatLottoCoin from '@/launch/hooks/contracts/GreatLottoCoin'
import WriteBtn from '@/launch/components/writeBtn'

export default function CoinManagement({coinTotal, baseCoinTotalBalance}) {

    const { recover, isLoading, isPending } = useGreatLottoCoin()

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

