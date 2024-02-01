'use client';

import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'

const inter = Inter({ subsets: ['latin'] })

import { useDark } from "./hooks/dark";
import { DarkContext, ToggleDarkContext } from './hooks/darkContext';

import { useI18nLocale } from './hooks/i18nLocale'
import { LocaleContext, SwitchLocaleContext } from './hooks/localeContext'

import {NextIntlClientProvider} from 'next-intl';

export default function RootLayout({ children }) {

    const {isDark, toggleDarkMode} = useDark()
    const {locale, switchLocale, messages} = useI18nLocale()
    
  return (
    <html lang={locale} data-bs-theme={isDark ? 'dark' : 'light'}>
        <head>
            <title>Great Lotto</title>
            <meta name="description" content="Great Lotto"/>
        </head>
        <body className={inter.className}>
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
        </body>
    </html>
  )
}
