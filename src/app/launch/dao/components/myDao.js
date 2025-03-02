'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Card from '@/launch/components/card'
import { Stack, Typography } from '@mui/material';

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
            <Stack direction="column" spacing={1}>
                <Typography variant="subtitle1">Balance: {gldc(coinBalance)}</Typography>
                <Typography variant="subtitle1">Benefit Rate: {benefitRate ? rate(Number(benefitRate)/10**8) : 'No Benefit'}</Typography>
                {children}
            </Stack>
        </Card>

    </>

  )
}

