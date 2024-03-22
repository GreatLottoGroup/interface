'use client';

import { useState } from 'react'

import MyInvestmentCoin from './components/myInvestment'
import BeneficiaryList from '@/launch/dao/components/beneficiaryList'
import BenefitPool from '@/launch/dao/components/benefitPool'

import Redeem from './components/redeem'
import Deposit from './components/deposit'

import useAddress from "@/launch/hooks/address"

import useCurrentBlock from '@/launch/hooks/currentBlock'

import useInvestmentCoin from '@/launch/hooks/contracts/InvestmentCoin'

export default function Dao() {

    const { DaoBenefitPoolContractAddress } = useAddress();

    const { currentBlock, setCurrentBlock } = useCurrentBlock()
    const [poolBalance, setPoolBalance] = useState(0n)


  return (
    <>
    <div className='mb-3 row'>
        <div className='col-4'>
            <MyInvestmentCoin currentBlock={currentBlock}/>
            <div className='mb-3'></div>
            <BenefitPool poolBalance={poolBalance} setPoolBalance={setPoolBalance} useBenefit={useInvestmentCoin}/>
        </div>
        <div className='col'>
            <Deposit setCurrentBlock={setCurrentBlock}/>
            <div className='mb-3'></div>
            <Redeem setCurrentBlock={setCurrentBlock}/>
        </div>
    </div>

    <div className='mb-3 row'>
        <div className='col'>  
            <BeneficiaryList poolBalance={poolBalance} useBenefit={useInvestmentCoin} finalBenefitAddress={DaoBenefitPoolContractAddress} currentBlock={currentBlock}/>
        </div>
    </div>

    </>

  )
}

