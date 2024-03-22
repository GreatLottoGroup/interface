'use client';

import { useContext } from 'react';

import { WagmiProvider, createConfig } from 'wagmi'
import { mainnet, holesky, sepolia, hardhat } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getDefaultConfig, ConnectKitProvider  } from 'connectkit';

import Image from 'next/image'
import { blo } from "blo";

import { DarkContext } from '@/hooks/darkContext';
import { LocaleContext } from '@/hooks/localeContext'
 
hardhat.name = "Localhost 8545";

holesky.rpcUrls.default.http = ['https://rpc.holesky.ethpandaops.io'];
sepolia.rpcUrls.default.http = ['https://eth-sepolia.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY];

const cnf = getDefaultConfig({
    appName: 'GreatLotto',
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [sepolia, holesky, hardhat, 
        //mainnet
    ],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
})

const config = createConfig(cnf)

const queryClient = new QueryClient()

const MyAvatar = ({ address, ensImage, ensName, size, radius }) => {
    return (
        <Image src={ensImage || blo(address)} alt={ensName || address} style={{
            overflow: "hidden",
            borderRadius: radius,
        }} width={size} height={size} />
    )
}

const connectKitLanguage = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
    pt: 'pt-BR',
    ja: 'ja-JP',
    'zh-CN': 'zh-CN',
    'zh-HK': 'zh-CN',
}

export default function AppLayout({ children }) {

    const isDark = useContext(DarkContext)
    const locale = useContext(LocaleContext)

  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}> 
            <ConnectKitProvider theme="default" mode={isDark ? 'dark' : 'light'} options={{
                customAvatar: MyAvatar,
                language: connectKitLanguage[locale]
            }}
            >
                { children }
            </ConnectKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  )
}
