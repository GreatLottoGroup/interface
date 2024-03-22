'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { C, formatAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import Card from '@/launch/components/card'

import useCoin from '@/launch/hooks/coin'
import useInvestmentCoin from '@/launch/hooks/contracts/InvestmentCoin'

export default function MyInvestmentCoin({currentBlock, children}) {

    const { address: accountAddress } = useAccount()
    const { InvestmentCoinContractAddress } = useAddress()

    const [coinBalance, setCoinBalance] = useState(0)
    const [benefitRate, setBenefitRate] = useState(0)

    const { getBalance } = useCoin()
    const { getBenefitRate } = useInvestmentCoin()

    const initData = async () => {
        setCoinBalance(await getBalance(InvestmentCoinContractAddress))
        setBenefitRate(await getBenefitRate())
    }

    useEffect(()=>{

        console.log('useEffect~')
        initData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, currentBlock])

  return (
    <>
        <Card title="My Investment Coin" reload={initData}>
            <p className="card-text mb-1">Balance: {formatAmount(coinBalance)} GLIC</p>
            <p className="card-text mb-1">Benefit Rate: {benefitRate ? Number(benefitRate)/10**8 + ' %' : 'No Benefit'}</p>
            {children}
        </Card>
    </>

  )
}

