'use client';

import { useAccount } from 'wagmi'

import DaoManagement from './components/daoM'
import CoinManagement from './components/coinM'
import NftManagement from './components/nftM'
import ChannelList from '../channel/components/channelList';

import { isOwner } from '@/launch/hooks/globalVars'

export default function Management() {

  const { address: accountAddress } = useAccount()

  return (
    <>
    {isOwner(accountAddress) ? (
        <>
        <div className='mb-3 row'>
            <div className='col'>
                <DaoManagement />
                <div className='mb-3'></div>
                <NftManagement />
            </div>
            <div className='col'>
                <CoinManagement />
            </div>
        </div>
        <div className='mb-3 row'>
            <div className='col'>
                <ChannelList hasActions={true} />
            </div>
        </div>
        </>
) : (
        <div className='border px-3 py-3 mb-3 row'>
            <div className='col'>
                <h3>Please use the administrator account</h3>
            </div>
        </div>
    )}

    </>

  )
}

