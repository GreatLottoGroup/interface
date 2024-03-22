'use client';

import DaoManagement from './components/daoM'
import CoinManagement from './components/coinM'
import GreatCoin from '../explore/components/greatCoin'
import NftManagement from './components/nftM'
import ChannelList from '../channel/components/channelList';

export default function Management() {

  return (
    <>
        <div className='mb-3 row'>
            <div className='col'>
                <DaoManagement />
                <div className='mb-3'></div>
                <NftManagement />
            </div>
            <div className='col'>
                <GreatCoin title="GreatLotto Coin Recover">
                    <CoinManagement />
                </GreatCoin>
            </div>
        </div>
        <div className='mb-3 row'>
            <div className='col'>
                <ChannelList hasActions={true} />
            </div>
        </div>
    </>

  )
}

