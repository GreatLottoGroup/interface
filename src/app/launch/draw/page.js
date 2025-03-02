'use client';

import { useState, useContext } from 'react'
import useCurrentBlock from '@/launch/hooks/currentBlock'
import { Stack, Tabs, Tab } from '@mui/material'
import { IsMobileContext } from '@/hooks/mediaQueryContext'

import DrawTicket from './components/drawTicket'
import Rollup from './components/rollup'
import BlockList from './components/blockList'

export default function Draw() {
    const {currentBlock, setCurrentBlock} = useCurrentBlock()
    const isMobile = useContext(IsMobileContext);
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        isMobile ? (
            <>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
                    <Tab label="Block List" />
                    <Tab label="Draw" />
                    <Tab label="Rollup" />
                </Tabs>
                {tabValue === 0 && <BlockList currentBlock={currentBlock}/>}
                {tabValue === 1 && <DrawTicket setCurrentBlock={setCurrentBlock}/>}
                {tabValue === 2 && <Rollup setCurrentBlock={setCurrentBlock}/>}
            </>
        ) : (
            <Stack spacing={2} direction="column">
                <BlockList currentBlock={currentBlock}/>
                <DrawTicket setCurrentBlock={setCurrentBlock}/>
                <Rollup setCurrentBlock={setCurrentBlock}/>
            </Stack>
        )
    )
}

