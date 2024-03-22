'use client';

import { useState, useEffect, Children, cloneElement, isValidElement } from 'react'
import { GreatCoinDecimals, formatAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import Card from '@/launch/components/card'
import useCoin from '@/launch/hooks/coin'

export default function GreatCoin({children, title}) {

    const { GreatCoinContractAddress, CoinList } = useAddress();

    const [coinTotal, setCoinTotal] = useState(0n)
    const [baseCoinBalance, setBaseCoinBalance] = useState([])
    const [baseCoinTotalBalance, setBaseCoinTotalBalance] = useState(0n)

    const { getBalance, totalSupply } = useCoin()

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

    Children.map(children, child =>{
        if(isValidElement(child)){
            return null;
        }else{
            return cloneElement(child, {coinTotal, baseCoinTotalBalance});
        }
    });

    useEffect(()=>{

        console.log('useEffect~')
        getCoinsData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <Card title={title ?? "GreatLotto Coin"} reload={getCoinsData}>
            <p className="card-text mb-1">GreatLotto Coin Total Supply: {formatAmount(coinTotal)} GLC</p>
            <p className="card-text mb-1">Base Coin Total Balance: {formatAmount(baseCoinTotalBalance)} </p>
            {baseCoinBalance.map(item => 
            <p key={item.name} className="card-text mb-1">Base {item.name} Balance: {formatAmount(item.balance, CoinList[item.name].decimals)} {item.name}</p>
            )}
            {children}
        </Card>
    </>

  )
}

