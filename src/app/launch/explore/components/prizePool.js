'use client';

import { useState, useEffect } from 'react'
import { formatAmount } from '@/launch/hooks/globalVars'

import useCoin from '@/launch/hooks/coin'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import Card from '@/launch/components/card'
import useAddress from "@/launch/hooks/address"

export default function PrizePool() {

    const { getBalance } = useCoin()
    const { getRollupBalance } = usePrizePool()

    const [prizePoolBalance, setPrizePoolBalance] = useState()
    const [guaranteePoolBalance, setGuaranteePoolBalance] = useState()
    const [rollupPoolBalance, setRollupPoolBalance] = useState()
    
    const { PrizePoolContractAddress, GreatCoinContractAddress, GuaranteePoolContractAddress } = useAddress();

    const initInfo = async () => {
        
        setPrizePoolBalance(await getBalance(GreatCoinContractAddress, PrizePoolContractAddress));
        setGuaranteePoolBalance(await getBalance(GreatCoinContractAddress, GuaranteePoolContractAddress));
        setRollupPoolBalance(await getRollupBalance());

    }


    useEffect(()=>{
        
        console.log('useEffect~')

        initInfo()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <Card title="GreatLotto Coin" reload={initInfo}>
            <p className="card-text mb-1">Prize Pool Balance: <strong className='ms-2'>{formatAmount(prizePoolBalance)} $</strong></p>
            <p className="card-text mb-1">Guarantee Pool Balance: <strong className='ms-2'>{formatAmount(guaranteePoolBalance)} $</strong> </p>
            <p className="card-text mb-1">Rollup Pool Balance: <strong className='ms-2'>{formatAmount(rollupPoolBalance)} $</strong> </p>
        </Card>
        
    </>

  )
}
