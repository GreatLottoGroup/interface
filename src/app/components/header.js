'use client';

import { useContext } from 'react';
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation';
// 导入 MUI 组件
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

import BrandLogo from './brandLogo'
import Setting from './setting'

import { DarkContext } from '@/hooks/darkContext';
import { IsMobileContext, IsTabletContext, IsDesktopContext } from '@/hooks/mediaQueryContext';

export default function Header({children, navList}) {

    const isDark = useContext(DarkContext);
    const isMobile = useContext(IsMobileContext);
    const isTablet = useContext(IsTabletContext);
    const isDesktop = useContext(IsDesktopContext);

    console.log('isMobile: ', isMobile);
    console.log('isTablet: ', isTablet);
    console.log('isDesktop: ', isDesktop);


    let segment = useSelectedLayoutSegment()
    console.log('segment: ', segment);
    if(!segment){
        segment = navList[0].name;
    }

    const navListItems = navList.map((item, index) => 
        <li key={index}><Link href={item.href} className={"nav-link px-2 fs-5 " + (item.name == segment ? "active" : "")} >{item.title}</Link></li>  
    );

    return (
        <AppBar 
            position="static" 
            elevation={0} 
            sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                background: 'transparent',  // 移除底色
                color: 'inherit',
                marginBottom: '1rem',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BrandLogo />
                        <Typography variant="h5" sx={{ ml: 2 }}>
                            Great Lotto
                        </Typography>
                    </Box>
                </Link>

                <Box sx={{ display: 'flex', flexGrow: 1, ml: 3 }}>
                    {isTablet && 
                        navList.map((item, index) => (
                            <Button
                                key={index}
                                component={Link}
                                href={item.href}
                                color="inherit"
                                sx={{
                                    fontSize: '1.1rem',
                                    textTransform: 'none',
                                    ...(item.name === segment && {
                                        borderBottom: 2,
                                        borderColor: 'currentColor'
                                    })
                                }}
                            >
                                {item.title}
                            </Button>
                        ))
                    }
                </Box>

                {children}

                <Setting />
            </Toolbar>
        </AppBar>
    )
}
  