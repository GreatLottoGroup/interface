'use client';

import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { DaoCoinDecimals, formatAmount, DaoCoinContractAddress } from '@/launch/hooks/globalVars'
import useCoin from '@/launch/hooks/coin'
import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'

export default function MyDaoCoin({currentBlock, children}) {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const [coinBalance, setCoinBalance] = useState(0)
    const [benefitRate, setBenefitRate] = useState(0)

    const { getBalance } = useCoin()
    const { getBenefitRate } = useDaoCoin()

    const getCoinBalance = async () => {
        let balance = await getBalance(DaoCoinContractAddress)
        setCoinBalance(balance)
        return balance;
    }

    const getDaoBenefitRate = async () => {
        let rate = await getBenefitRate()
        setBenefitRate(rate)
        return rate
    }


    useEffect(()=>{

        console.log('useEffect~')
        getCoinBalance()
        getDaoBenefitRate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, publicClient, currentBlock])

  return (
    <>

        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">My Dao Coin:</h5>
                <p className="card-text mb-1">Balance: {formatAmount(coinBalance, DaoCoinDecimals)} GLDC</p>
                <p className="card-text mb-1">Benefit Rate: {benefitRate ? Number(benefitRate)/10**8 + ' %' : 'No Benefit'}</p>
                {children}
            </div>
        </div>

    </>

  )
}

