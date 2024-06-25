'use client';

import { useState } from 'react'

import MyDaoCoin from './components/myDao'
import BeneficiaryList from './components/beneficiaryList'
import BenefitPool from './components/benefitPool'

import { FinalBenefitAddress } from '@/launch/hooks/globalVars'

import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'
import useDaoBenefitPool from '@/launch/hooks/contracts/DaoBenefitPool'

export default function Dao() {

    const [poolBalance, setPoolBalance] = useState(0n)
    const [poolBalanceByEth, setPoolBalanceByEth] = useState(0n)

  return (
    <>
    <div className='mb-3 row'>
        <div className='col'>
            <MyDaoCoin/>
        </div>
        <div className='col'>
            <BenefitPool poolBalance={poolBalance}  setPoolBalance={setPoolBalance} isEth={false} useBenefitPool={useDaoBenefitPool}/>
        </div>
        <div className='col'>
            <BenefitPool poolBalance={poolBalanceByEth}  setPoolBalance={setPoolBalanceByEth} isEth={true} useBenefitPool={useDaoBenefitPool}/>
        </div>
    </div>
    <div className='mb-3 row'>
        <div className='col'>  
            <BeneficiaryList poolBalance={poolBalance}  poolBalanceByEth={poolBalanceByEth} useGovCoin={useDaoCoin} finalBenefitAddress={FinalBenefitAddress} />
        </div>
    </div>

    </>

  )
}

