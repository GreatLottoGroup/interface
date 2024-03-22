'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { formatAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import useCoin from '@/launch/hooks/coin'
import useGreatLottoCoin from '@/launch/hooks/contracts/GreatLottoCoin'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'

export default function MyCoin({currentBlock}) {

    const { address: accountAddress } = useAccount()
    const { GreatCoinContractAddress, CoinList } = useAddress();

    const withdrawCoinList = Object.keys(CoinList).filter(name=>
        name != 'GLC'
    )

    const [coinBalance, setCoinBalance] = useState(0)

    const { getBalance } = useCoin()
    const { withdrawTo, isLoading, isPending } = useGreatLottoCoin()
    
    const withdrawAmountEl = useRef(null);
    const withdrawCoinEl = useRef(null)

    const getCoinBalance = async () => {
        let balance = await getBalance(GreatCoinContractAddress)
        setCoinBalance(balance)
        return balance;
    }

    const withdrawExecute = async () => {
        let withdrawAmount = withdrawAmountEl.current.value
        let withdrawCoin = CoinList[withdrawCoinEl.current.value].address;
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
    }, [accountAddress, currentBlock])

  return (
    <>
        <Card title="My GreatLotto Coin" reload={getCoinBalance}>
            <p className="card-text">Balance: {formatAmount(coinBalance)} GLC</p>

            <div className="input-group input-group-sm mb-1">
                <input type="number" className="form-control" placeholder='Amount...' ref={withdrawAmountEl}/>
                <select className="form-select" ref={withdrawCoinEl}>
                    <option value="">Coin...</option>
                    {withdrawCoinList.map( name =>
                        <option key={name} value={name}>{name}</option>
                    )}
                </select>
                <WriteBtn action={withdrawExecute} isLoading={isLoading || isPending} > Withdraw </WriteBtn>
            </div>
            
        </Card>
    </>

  )
}

