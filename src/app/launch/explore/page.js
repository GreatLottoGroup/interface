'use client';

import PrizePool from './components/prizePool'
import GreatCoin from './components/greatCoin'

export default function Explore() {


  return (
    <>
        <div className='mb-3 row'>
            <div className='col'>
                <PrizePool isEth={false}/>
                <div className='mb-3'></div>
                <PrizePool isEth={true}/>
            </div>
            <div className='col'>
                <GreatCoin isEth={false}/>
                <div className='mb-3'></div>
                <GreatCoin isEth={true}/>
            </div>
        </div>
    </>


  )
}

