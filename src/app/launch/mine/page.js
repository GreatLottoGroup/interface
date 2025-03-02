'use client';

import { useContext, useState } from 'react'
import Link from 'next/link'
import { Stack, Tabs, Tab } from '@mui/material'
import Grid from '@mui/material/Grid2';
import MyCoinBase from './components/myCoinBase'
import WrapEthCoin from './components/wrapEthCoin'
import MyDaoCoin from '../dao/components/myDao'
import MyInvestmentCoin from '../investment/components/myInvestment'
import Tickets from './components/tickets'
import { IsMobileContext } from '@/hooks/mediaQueryContext';
import MyChannelCoin from '../channel/components/myChannel'

export default function Mine() {
    const isMobile = useContext(IsMobileContext);
    const [tabValue, setTabValue] = useState(0);

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

    const myTicketsContent = () => (
        <Tickets />
    );

    const myCoinContent = () => (
        <Stack spacing={2} direction="column">
            <MyCoinBase isEth={false}/>
            <MyCoinBase isEth={true}>
                <WrapEthCoin />
            </MyCoinBase>
        </Stack>
    );

    const myDaoContent = () => (
        <MyDaoCoin>
            <Link className="card-link" href="/launch/dao">DAO View</Link>
        </MyDaoCoin>
    );

    const myInvestmentContent = () => (
        <Stack spacing={2} direction="column">
            <MyInvestmentCoin isEth={false}>
                <Link className="card-link" href="/launch/investment">Investment View</Link>
            </MyInvestmentCoin>
            <MyInvestmentCoin isEth={true}>
                <Link className="card-link" href="/launch/investment">Investment View</Link>
            </MyInvestmentCoin>
        </Stack>
    );

    const myChannelContent = () => (
        <MyChannelCoin />
    );

    return (
        <Stack spacing={2} direction="column">
            {isMobile ? (
                <>
                    <Tabs value={tabValue} onChange={handleTabChange} 
                        variant="scrollable" 
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            mb: 2,
                            '& .MuiTabs-scrollButtons.Mui-disabled': {
                                opacity: 0.3,
                            }
                        }}
                    >
                        <Tab label="My Tickets" />
                        <Tab label="My Coins" />
                        <Tab label="My Dao" />
                        <Tab label="My Investment" />
                        <Tab label="My Channel" />
                    </Tabs>
                    {tabValue === 0 && myTicketsContent()}
                    {tabValue === 1 && myCoinContent()}
                    {tabValue === 2 && myDaoContent()}
                    {tabValue === 3 && myInvestmentContent()}
                    {tabValue === 4 && myChannelContent()}
                </>
            ) : (
                <>
                    <Grid container spacing={2} columns="12">
                        <Grid size={gridSize(4)}>
                            {myCoinContent()}
                        </Grid>
                        <Grid size={gridSize(4)}>
                            {myInvestmentContent()}
                        </Grid>
                        <Grid size={gridSize(4)}>
                            <Stack spacing={2} direction="column">
                                {myDaoContent()}
                                {myChannelContent()}
                            </Stack>
                        </Grid>
                    </Grid>
                    <Stack>
                        {myTicketsContent()}
                    </Stack>
                </>
            )}
        </Stack>
    );
}

