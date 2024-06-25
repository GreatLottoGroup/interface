'use client';

import useAddress from "@/launch/hooks/address"
import MintCoinBase from './components/mintCoinBase';

export default function MintTestCoin() {

    const { GreatCoinContractAddress, GreatEthContractAddress } = useAddress();

  return (
    <>
    <div className='mb-3 row'>
        <div className='col'>
            <MintCoinBase coinAddress={GreatCoinContractAddress} coinName="GreatLottoCoin"></MintCoinBase>
        </div>
        <div className='col'>
            <MintCoinBase coinAddress={GreatEthContractAddress} coinName="GreatLottoEth"></MintCoinBase>
        </div>
    </div>
    </>

  )

}

