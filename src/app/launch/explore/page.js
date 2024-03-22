'use client';

import PrizePool from './components/prizePool'
import GreatCoin from './components/greatCoin'

export default function Explore() {


  return (
    <>
        <div className='mb-3 row'>
            <div className='col'>
                <PrizePool />
            </div>
            <div className='col'>
                <GreatCoin />
            </div>
        </div>
    </>


  )
}

