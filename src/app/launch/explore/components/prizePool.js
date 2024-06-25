'use client';

import { useState, useEffect } from 'react'

import useCoin from '@/launch/hooks/coin'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import Card from '@/launch/components/card'
import useAddress from "@/launch/hooks/address"
import { usd, eth } from "@/launch/components/coinShow"


export default function PrizePool({isEth}) {

    const { getBalance } = useCoin()
    const { getRollupBalance } = usePrizePool()

    const [prizePoolBalance, setPrizePoolBalance] = useState(0)
    const [guaranteePoolBalance, setGuaranteePoolBalance] = useState(0)
    const [rollupPoolBalance, setRollupPoolBalance] = useState(0)
    
    const { PrizePoolContractAddress, GreatCoinContractAddress, GreatEthContractAddress, GuaranteePoolContractAddress } = useAddress();

    const coinAddr = isEth ? GreatEthContractAddress : GreatCoinContractAddress;

    const initInfo = async () => {
        
        setPrizePoolBalance(await getBalance(PrizePoolContractAddress, coinAddr));
        setGuaranteePoolBalance(await getBalance(GuaranteePoolContractAddress, coinAddr));
        setRollupPoolBalance(await getRollupBalance(isEth));

    }


    useEffect(()=>{
        
        console.log('useEffect~')

        initInfo()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <Card title={"GreatLotto Prize Pool " + (isEth ? 'By Eth Coin' : 'By Standard Coin')} reload={initInfo}>
            <p className="card-text mb-1">Prize Pool Balance: {isEth ? eth(prizePoolBalance) : usd(prizePoolBalance)}</p>
            <p className="card-text mb-1">Guarantee Pool Balance: {isEth ? eth(guaranteePoolBalance) : usd(guaranteePoolBalance)}</p>
            <p className="card-text mb-1">Rollup Pool Balance: {isEth ? eth(rollupPoolBalance) : usd(rollupPoolBalance)}</p>
        </Card>
        
    </>

  )
}
