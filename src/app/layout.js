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
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <title>Great Lotto</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            <meta name="description" content="Best Lotto in the world" />

            <link rel="manifest" href="/manifest.json"/>

            <meta name="application-name" content="Great Lotto" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Great Lotto" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#ffffff" />		

            <meta content="yes" name="apple-touch-fullscreen"/>

            <link rel="apple-touch-icon" href="/icons/icon-192.png"/>
            <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
            <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-192.png" />
            <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/icons/icon-114.png"></link>

            <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />

            <link rel="shortcut icon" href="/favicon.ico" />

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
