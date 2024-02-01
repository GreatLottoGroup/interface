'use client';

import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { GreatCoinDecimals, formatAmount, GreatCoinContractAddress, CoinList } from '@/launch/hooks/globalVars'
import useCoin from '@/launch/hooks/coin'
import useGreatLottoCoin from '@/launch/hooks/contracts/GreatLottoCoin'

export default function CoinManagement() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const [coinTotal, setCoinTotal] = useState(0n)
    const [baseCoinBalance, setBaseCoinBalance] = useState([])
    const [baseCoinTotalBalance, setBaseCoinTotalBalance] = useState(0n)

    const { getBalance, totalSupply } = useCoin()
    const { recover, error, setError, isLoading, isSuccess } = useGreatLottoCoin()

    const getAmountWithDecimals = (amount, decimals) => {
        return amount * 10n ** BigInt(GreatCoinDecimals - decimals)
    }
    
    const getCoinsData = async () => {

        let baseCoin = []
        let baseCoinTotal = 0n;
        
        await Promise.all(Object.keys(CoinList).map(async (name)=>{
            if(name =='GLC'){
                let total = await totalSupply(GreatCoinContractAddress);
                setCoinTotal(total)
            }else{
                let balance = await getBalance(CoinList[name].address, GreatCoinContractAddress);
                baseCoin.push({ name, balance });
                baseCoinTotal += getAmountWithDecimals(balance, CoinList[name].decimals);
                console.log(baseCoinTotal)
            }
        }))

        setBaseCoinBalance(baseCoin);
        setBaseCoinTotalBalance(baseCoinTotal);
    }

    const recoverExecute = async () => {
        let tx = await recover();
        if(tx){
            getCoinsData()
        }
    }


    useEffect(()=>{

        console.log('useEffect~')
        getCoinsData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, publicClient])

  return (
    <>

        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">GreatLotto Coin Recover:</h5>
                <p className="card-text mb-1">GreatLotto Coin Total Supply: {formatAmount(coinTotal, GreatCoinDecimals)} GLC</p>
                <p className="card-text mb-1">Base Coin Total Balance: {formatAmount(baseCoinTotalBalance, GreatCoinDecimals)} </p>
                {baseCoinBalance.map(item => 
                <p key={item.name} className="card-text mb-1">Base {item.name} Balance: {formatAmount(item.balance, CoinList[item.name].decimals)} {item.name}</p>
                )}
                {coinTotal < baseCoinTotalBalance ? (
                    <button type="button" disabled={!!isLoading} className='btn btn-primary mt-2'  onClick={()=>{recoverExecute()}}>Recover {isLoading ? '...' : ''}</button>
                ) : (
                    <button type="button" disabled={true} className='btn btn-primary mt-2' >No Need Recover</button>
                )}
                {isSuccess && (
                    <p className="card-text text-success">Success!</p>
                )}
            </div>
        </div>

    </>

  )
}

