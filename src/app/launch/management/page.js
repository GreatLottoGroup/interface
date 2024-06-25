'use client';

import DaoManagement from './components/daoM'
import CoinManagement from './components/coinM'
import GreatCoin from '../explore/components/greatCoin'
import NftManagement from './components/nftM'
import ChannelList from '../channel/components/channelList';
import RewardManagement from './components/rewardM'
import GovCoinManagement from './components/govCoinM'

export default function Management() {

  return (
    <>
        <div className='mb-3 row'>
            <div className='col'>
                <DaoManagement />
                <div className='mb-3'></div>
                <NftManagement />
                <div className='mb-3'></div>
                <GreatCoin title="GreatLotto Coin Recover" isEth={false}>
                    <CoinManagement />
                </GreatCoin>
                <div className='mb-3'></div>
                <GreatCoin title="GreatLotto Eth Coin Recover" isEth={true}>
                    <CoinManagement />
                </GreatCoin>
            </div>
            <div className='col'>
                <RewardManagement/>
                <div className='mb-3'></div>
                <GovCoinManagement/>
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

