'use client';

import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { InvestmentCoinDecimals, formatAmount, InvestmentCoinContractAddress } from '@/launch/hooks/globalVars'
import useCoin from '@/launch/hooks/coin'
import useInvestmentCoin from '@/launch/hooks/contracts/InvestmentCoin'

export default function MyInvestmentCoin({currentBlock, children}) {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const [coinBalance, setCoinBalance] = useState(0)
    const [benefitRate, setBenefitRate] = useState(0)

    const { getBalance } = useCoin()
    const { getBenefitRate } = useInvestmentCoin()

    const getCoinBalance = async () => {
        let balance = await getBalance(InvestmentCoinContractAddress)
        setCoinBalance(balance)
        return balance;
    }

    const getInvestmentBenefitRate = async () => {
        let rate = await getBenefitRate()
        setBenefitRate(rate)
        return rate
    }


    useEffect(()=>{

        console.log('useEffect~')
        getCoinBalance()
        getInvestmentBenefitRate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, publicClient, currentBlock])

  return (
    <>

        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">My Investment Coin:</h5>
                <p className="card-text mb-1">Balance: {formatAmount(coinBalance, InvestmentCoinDecimals)} GLIC</p>
                <p className="card-text mb-1">Benefit Rate: {benefitRate ? Number(benefitRate)/10**8 + ' %' : 'No Benefit'}</p>
                {children}
            </div>
        </div>

    </>

  )
}

