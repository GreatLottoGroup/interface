'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import useAddress from "@/launch/hooks/address"
import Card from '@/launch/components/card'

import useInvestmentCoinBase from '@/launch/hooks/contracts/base/InvestmentCoinBase'
import { glic, glieth, rate } from "@/launch/components/coinShow"
import { Stack, Typography } from '@mui/material';

export default function MyInvestmentCoin({isEth, currentBlock, children}) {

    const { address: accountAddress } = useAccount()
    const { InvestmentCoinContractAddress, InvestmentEthContractAddress } = useAddress()

    const coinAddr = isEth ? InvestmentEthContractAddress: InvestmentCoinContractAddress;

    const [coinBalance, setCoinBalance] = useState(0)
    const [benefitRate, setBenefitRate] = useState(0)

    const { getBenefitRate, getBalance } = useInvestmentCoinBase(coinAddr)

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
        <Card title={"My Investment " + (isEth ? 'Eth Coin' : 'Coin')} reload={initData}>
            <Stack direction="column" spacing={1}>
                <Typography variant="subtitle1">Balance: {isEth ? glieth(coinBalance) : glic(coinBalance)}</Typography>
                <Typography variant="subtitle1">Benefit Rate: {benefitRate ? rate(Number(benefitRate)/10**8) : 'No Benefit'}</Typography>
                {children}
            </Stack>
        </Card>
    </>

  )
}

