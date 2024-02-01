'use client';

import Link from 'next/link'
import MyCoin from './myCoin'
import MyDaoCoin from '../../dao/components/myDao'
import MyInvestmentCoin from '../../investment/components/myInvestment'


export default function Account({currentBlock, setCurrentBlock}) {

  return (
    <>

    <div className='border px-3 py-3 mb-3 row'>
        <div className='col'>
            <div className='h5'>My Account
                <a className="btn btn-sm btn-outline-secondary ms-3" onClick={()=>{setCurrentBlock();}}>ReLoad</a>
            </div>

            <div className='row'>
                <div className='col'>
                    <MyCoin currentBlock={currentBlock}/>
                </div>
                <div className='col'>
                    <MyDaoCoin currentBlock={currentBlock}>
                        <Link className="card-link" href="/launch/dao">DAO View</Link>
                    </MyDaoCoin>
                </div>
                <div className='col'>
                    <MyInvestmentCoin currentBlock={currentBlock}>
                        <Link className="card-link" href="/launch/investment">Investment View</Link>
                    </MyInvestmentCoin>
                </div>

            </div>


        </div>
    </div>

    </>

  )
}

