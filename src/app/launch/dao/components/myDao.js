'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import useAddress from "@/launch/hooks/address"
import Card from '@/launch/components/card'

import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'
import { gldc, rate } from "@/launch/components/coinShow"

export default function MyDaoCoin({children}) {

    const { address: accountAddress } = useAccount()

    const [coinBalance, setCoinBalance] = useState(0)
    const [benefitRate, setBenefitRate] = useState(0)

    const { getBenefitRate, getBalance } = useDaoCoin()

    const initData = async () => {
        setCoinBalance(await getBalance())
        setBenefitRate(await getBenefitRate())
    }

    useEffect(()=>{

        console.log('useEffect~')
        initData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress])

  return (
    <>  
        <Card title="My Dao Coin" reload={initData}>
            <p className="card-text mb-1">Balance: {gldc(coinBalance)}</p>
            <p className="card-text mb-1">Benefit Rate: {benefitRate ? rate(Number(benefitRate)/10**8) : 'No Benefit'}</p>
            {children}
        </Card>

    </>

  )
}

