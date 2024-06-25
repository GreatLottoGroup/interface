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
import useInvestmentEth from '@/launch/hooks/contracts/InvestmentEth'
import useInvestmentBenefitPool from '@/launch/hooks/contracts/InvestmentBenefitPool'

export default function Investment() {

    const { DaoBenefitPoolContractAddress } = useAddress();

    const { currentBlock, setCurrentBlock } = useCurrentBlock()
    const [poolBalance, setPoolBalance] = useState(0n)
    const [poolBalanceByEth, setPoolBalanceByEth] = useState(0n)

  return (
    <>
    <div className='mb-3 row'>
        <div className='col'>
            <MyInvestmentCoin isEth={false} currentBlock={currentBlock}/>
            <div className='mb-3'></div>
            <BenefitPool poolBalance={poolBalance} setPoolBalance={setPoolBalance} isEth={false} useBenefitPool={useInvestmentBenefitPool} />
            <div className='mb-3'></div>
            <Deposit isEth={false} setCurrentBlock={setCurrentBlock}/>
            <div className='mb-3'></div>
            <Redeem isEth={false} setCurrentBlock={setCurrentBlock}/>
            <div className='mb-3'></div>
            <BeneficiaryList poolBalance={poolBalance} isEth={false} useGovCoin={useInvestmentCoin} finalBenefitAddress={DaoBenefitPoolContractAddress} currentBlock={currentBlock}/>
        </div>
        <div className='col'>
            <MyInvestmentCoin isEth={true} currentBlock={currentBlock}/>
            <div className='mb-3'></div>
            <BenefitPool poolBalance={poolBalanceByEth} setPoolBalance={setPoolBalanceByEth} isEth={true} useBenefitPool={useInvestmentBenefitPool} />
            <div className='mb-3'></div>
            <Deposit isEth={true} setCurrentBlock={setCurrentBlock}/>
            <div className='mb-3'></div>
            <Redeem isEth={true} setCurrentBlock={setCurrentBlock}/>
            <div className='mb-3'></div>
            <BeneficiaryList poolBalance={poolBalanceByEth} isEth={true} useGovCoin={useInvestmentEth} finalBenefitAddress={DaoBenefitPoolContractAddress} currentBlock={currentBlock}/>
        </div>
    </div>

    </>

  )
}

