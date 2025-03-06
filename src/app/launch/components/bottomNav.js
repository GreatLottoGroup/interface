'use client';

import { useState, useContext } from 'react'
import { useSelectedLayoutSegment } from 'next/navigation';

import Link from 'next/link'
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { StyledEngineProvider } from '@mui/material/styles';
import './bottomNav.css';

import { IsMobileContext } from '@/hooks/mediaQueryContext';
import { SetBottomSpaceContext } from '@/hooks/bottomSpaceContext';

const navList = [
    {title: 'Issue', name:'issue', href: '/launch/issue', icon: <ConfirmationNumberRoundedIcon />},
    {title: 'Draw', name:'draw', href: '/launch/draw', icon: <EmojiEventsRoundedIcon />},
    {title: 'Investment', name:'investment', href: '/launch/investment', icon: <PaidRoundedIcon />},
    {title: 'DAO', name:'dao', href: '/launch/dao', icon: <Diversity3RoundedIcon />},
    {title: 'Mine', name:'mine', href: '/launch/mine', icon: <AccountCircleRoundedIcon />},
];

export default function BottomNav() {


    let segment = useSelectedLayoutSegment()
    if(!segment){
        segment = navList[0].name;
    }

    const [value, setValue] = useState(segment);

    const navListItems = navList.map((item, index) =>
        <BottomNavigationAction component={Link} value={item.name} label={item.title} icon={item.icon} key={index} href={item.href} />
    );

    const isMobile = useContext(IsMobileContext);
    const setBottomSpace = useContext(SetBottomSpaceContext);
     
  return (
    <>
    {isMobile && (
        <StyledEngineProvider injectFirst>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, padding: '3px 0 8px 0' }} elevation={3}>
            <BottomNavigation  
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    setBottomSpace(0);
                }}  
            >
                {navListItems}
            </BottomNavigation>
        </Paper>
        </StyledEngineProvider>
    )}
    </>

  )
}

