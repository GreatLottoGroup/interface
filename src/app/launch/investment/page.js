'use client';

import { useState, useContext } from 'react'
import { Stack, Tabs, Tab } from '@mui/material'
import Grid from '@mui/material/Grid2'

import MyInvestmentCoin from './components/myInvestment'
import BeneficiaryList from '@/launch/dao/components/beneficiaryList'
import BenefitPool from '@/launch/dao/components/benefitPool'
import Redeem from './components/redeem'
import Deposit from './components/deposit'


import useAddress from "@/launch/hooks/address"
import { IsMobileContext } from '@/hooks/mediaQueryContext'

import useCurrentBlock from '@/launch/hooks/currentBlock'

import useInvestmentCoin from '@/launch/hooks/contracts/InvestmentCoin'
import useInvestmentEth from '@/launch/hooks/contracts/InvestmentEth'
import useInvestmentBenefitPool from '@/launch/hooks/contracts/InvestmentBenefitPool'

export default function Investment() {
    const isMobile = useContext(IsMobileContext);
    const { DaoBenefitPoolContractAddress } = useAddress();
    const { currentBlock, setCurrentBlock } = useCurrentBlock()
    const [poolBalance, setPoolBalance] = useState(0n)
    const [poolBalanceByEth, setPoolBalanceByEth] = useState(0n)
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const gridSize = (md) => {
        if(isMobile){
            return 12;
        }else{
            return md;
        }
    };

    const investmentContent = (isEth, _poolBalance, _setPoolBalance, _useGovCoin) => {
        return (
            <Stack spacing={2}>
                <MyInvestmentCoin isEth={isEth} currentBlock={currentBlock}/>
                <BenefitPool 
                poolBalance={_poolBalance} 
                setPoolBalance={_setPoolBalance} 
                isEth={isEth} 
                useBenefitPool={useInvestmentBenefitPool} 
            />
                <Deposit isEth={isEth} setCurrentBlock={setCurrentBlock}/>
                <Redeem isEth={isEth} setCurrentBlock={setCurrentBlock}/>
                <BeneficiaryList 
                    poolBalance={_poolBalance} 
                    isEth={isEth} 
                    useGovCoin={_useGovCoin} 
                    finalBenefitAddress={DaoBenefitPoolContractAddress} 
                    currentBlock={currentBlock}
                />
            </Stack>
        )
    }

  return (
      isMobile ? (
        <>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label="Standard Coin" />
            <Tab label="ETH Coin" />
          </Tabs>
          {tabValue === 0 && investmentContent(false, poolBalance, setPoolBalance, useInvestmentCoin)}
          {tabValue === 1 && investmentContent(true, poolBalanceByEth, setPoolBalanceByEth, useInvestmentEth)}
        </>
      ) : (
        <Grid container spacing={2} columns="12">
          <Grid size={gridSize(6)}>
            {investmentContent(false, poolBalance, setPoolBalance, useInvestmentCoin)}
          </Grid>
          <Grid size={gridSize(6)}>
            {investmentContent(true, poolBalanceByEth, setPoolBalanceByEth, useInvestmentEth)}
          </Grid>
        </Grid>
      )
  )
  
}
