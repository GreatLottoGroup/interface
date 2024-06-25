'use client';

import Link from 'next/link'
import MyCoinBase from './components/myCoinBase'
import WrapEthCoin from './components/wrapEthCoin'
import MyDaoCoin from '../dao/components/myDao'
import MyInvestmentCoin from '../investment/components/myInvestment'
import Tickets from './components/tickets'

export default function Mine() {


  return (
    <>

    <div className='mb-3 row'>
        <div className='col'>
            <MyCoinBase isEth={true}>
                <WrapEthCoin />
            </MyCoinBase>
        </div>
        <div className='col'>
            <MyCoinBase isEth={false}/>
            <div className='mb-3'></div>
            <MyDaoCoin>
                <Link className="card-link" href="/launch/dao">DAO View</Link>
            </MyDaoCoin>
        </div>
        <div className='col'>
            <MyInvestmentCoin isEth={false}>
                <Link className="card-link" href="/launch/investment">Investment View</Link>
            </MyInvestmentCoin>
            <div className='mb-3'></div>
            <MyInvestmentCoin isEth={true}>
                <Link className="card-link" href="/launch/investment">Investment View</Link>
            </MyInvestmentCoin>
        </div>
    </div>

    <div className='mb-3 row'>
        <div className='col'>
            <Tickets></Tickets>
        </div>
    </div>

    </>

  )
}

