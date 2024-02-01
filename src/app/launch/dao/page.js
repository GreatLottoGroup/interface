'use client';

import { useState } from 'react'

import MyDaoCoin from './components/myDao'
import BeneficiaryList from './components/beneficiaryList'
import BenefitPool from './components/benefitPool'

import { FinalBenefitAddress } from '@/launch/hooks/globalVars'

import useCurrentBlock from '@/launch/hooks/currentBlock'

import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'


export default function Dao() {

    const { currentBlock } = useCurrentBlock()

    const [poolBalance, setPoolBalance] = useState(0n)

  return (
    <>
    <div className='mb-3 row'>
        <div className='col'>
            <MyDaoCoin currentBlock={currentBlock}/>
        </div>
        <div className='col'>
            <BenefitPool poolBalance={poolBalance} setPoolBalance={setPoolBalance} useBenefit={useDaoCoin}/>
        </div>
    </div>
    <div className='mb-3 row'>
        <div className='col'>  
            <BeneficiaryList poolBalance={poolBalance} useBenefit={useDaoCoin} finalBenefitAddress={FinalBenefitAddress}/>
        </div>
    </div>

    </>

  )
}

