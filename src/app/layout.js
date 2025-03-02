'use client';

import { useState } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
//import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './globals.css'
//const inter = Inter({ subsets: ['latin'] })

import { useDark } from "./hooks/dark";
import { DarkContext, ToggleDarkContext } from './hooks/darkContext';

import { useI18nLocale } from './hooks/i18nLocale'
import { LocaleContext, SwitchLocaleContext } from './hooks/localeContext'

import { useMediaQueryContext } from './hooks/mediaQuery';
import { IsMobileContext, IsTabletContext, IsDesktopContext } from "./hooks/mediaQueryContext"
import { BottomSpaceContext, SetBottomSpaceContext } from './hooks/bottomSpaceContext';


import {NextIntlClientProvider} from 'next-intl';

export default function RootLayout({ children }) {

    const {isDark, toggleDarkMode} = useDark()
    const {locale, switchLocale, messages} = useI18nLocale()
    const {isMobile, isTablet, isDesktop} = useMediaQueryContext()
    const [bottomSpace, setBottomSpace] = useState(0)
    
  return (
    <html lang={locale} data-bs-theme={isDark ? 'dark' : 'light'} >
        <head>
            <title>Great Lotto</title>
            <meta name="description" content="Great Lotto"/>
        </head>
        <body>
        <AppRouterCacheProvider>
            <IsMobileContext.Provider value={isMobile}>
            <IsTabletContext.Provider value={isTablet}>
            <IsDesktopContext.Provider value={isDesktop}>
            <BottomSpaceContext.Provider value={bottomSpace}>
            <SetBottomSpaceContext.Provider value={setBottomSpace}>
                <DarkContext.Provider value={isDark}>
                    <ToggleDarkContext.Provider value={toggleDarkMode}>
                        <LocaleContext.Provider value={locale}>
                            <SwitchLocaleContext.Provider value={switchLocale}>
                                <NextIntlClientProvider locale={locale} messages={messages}>
                                    {children}
                                </NextIntlClientProvider>
                            </SwitchLocaleContext.Provider>
                        </LocaleContext.Provider>
                    </ToggleDarkContext.Provider>
                </DarkContext.Provider>    
            </SetBottomSpaceContext.Provider>
            </BottomSpaceContext.Provider>    
            </IsDesktopContext.Provider>
            </IsTabletContext.Provider>
            </IsMobileContext.Provider>
        </AppRouterCacheProvider>    
        </body>
    </html>
  )
}
