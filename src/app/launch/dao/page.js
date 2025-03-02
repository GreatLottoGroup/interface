'use client';

import { useState, useContext } from 'react'
import { Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'

import MyDaoCoin from './components/myDao'
import BeneficiaryList from './components/beneficiaryList'
import BenefitPool from './components/benefitPool'

import { FinalBenefitAddress } from '@/launch/hooks/globalVars'
import { IsMobileContext } from '@/hooks/mediaQueryContext'

import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'
import useDaoBenefitPool from '@/launch/hooks/contracts/DaoBenefitPool'

export default function Dao() {
    const isMobile = useContext(IsMobileContext);
    const [poolBalance, setPoolBalance] = useState(0n)
    const [poolBalanceByEth, setPoolBalanceByEth] = useState(0n)

    const gridSize = (md) => {
        if(isMobile){
            return 12;
        }else{
            return md;
        }
    };

  return (
    <Stack spacing={2} direction="column">
      <Grid container spacing={2} columns="12">
        <Grid size={gridSize(4)}>
          <MyDaoCoin/>
        </Grid>
        <Grid size={gridSize(4)}>
            <BenefitPool poolBalance={poolBalance} setPoolBalance={setPoolBalance} isEth={false} useBenefitPool={useDaoBenefitPool}/>
        </Grid>
        <Grid size={gridSize(4)}>
            <BenefitPool poolBalance={poolBalanceByEth} setPoolBalance={setPoolBalanceByEth} isEth={true} useBenefitPool={useDaoBenefitPool}/>
        </Grid>
      </Grid>
      
      <Stack>
        <BeneficiaryList poolBalance={poolBalance} poolBalanceByEth={poolBalanceByEth} useGovCoin={useDaoCoin} finalBenefitAddress={FinalBenefitAddress} />
      </Stack>
    </Stack>
  )
}

