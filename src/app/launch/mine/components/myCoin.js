'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { GreatCoinDecimals, formatAmount, GreatCoinContractAddress, CoinList, getTokenAddress } from '@/launch/hooks/globalVars'
import useCoin from '@/launch/hooks/coin'
import useGreatLottoCoin from '@/launch/hooks/contracts/GreatLottoCoin'

const withdrawCoinList = Object.keys(CoinList).filter(name=>
    name != 'GLC'
)

export default function MyCoin({currentBlock}) {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const [coinBalance, setCoinBalance] = useState(0)

    const { getBalance } = useCoin()
    const { withdrawTo, error, setError, isLoading, isSuccess } = useGreatLottoCoin()
    
    const withdrawAmountEl = useRef(null);
    const withdrawCoinEl = useRef(null)

    const getCoinBalance = async () => {
        let balance = await getBalance(GreatCoinContractAddress)
        setCoinBalance(balance)
        return balance;
    }

    const withdrawExecute = async () => {
        let withdrawAmount = withdrawAmountEl.current.value
        let withdrawCoin = getTokenAddress(withdrawCoinEl.current.value)
        console.log(withdrawAmount)
        console.log(withdrawCoin)
        if(withdrawAmount > 0 && withdrawAmount <= coinBalance && withdrawCoin){
            let tx = await withdrawTo(withdrawCoin, withdrawAmount)
            if(tx){
                getCoinBalance()
                withdrawAmountEl.current.value = ''
                withdrawCoinEl.current.value = ''
            }
        }else{
            console.log('error~')
        }
    }


    useEffect(()=>{

        console.log('useEffect~')
        getCoinBalance()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, publicClient, currentBlock])

  return (
    <>

        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">My GreatLotto Coin:</h5>
                <p className="card-text">Balance: {formatAmount(coinBalance, GreatCoinDecimals)} GLC</p>

                <div className="input-group input-group-sm mb-1">
                    <input type="number" className="form-control" placeholder='Amount...' ref={withdrawAmountEl}/>
                    <select className="form-select" ref={withdrawCoinEl}>
                        <option value="">Coin...</option>
                        {withdrawCoinList.map( name =>
                            <option key={name} value={name}>{name}</option>
                        )}
                    </select>
                    <button type="button" disabled={!!isLoading} className='btn btn-primary'  onClick={()=>{withdrawExecute()}}> Withdraw {isLoading ? '...' : ''}</button>
                </div>

            </div>
        </div>

    </>

  )
}

