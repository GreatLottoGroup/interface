'use client';

import { useState, useEffect, Children, cloneElement, isValidElement } from 'react'
import { GreatCoinDecimals, getCoinListByIsEth } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import Card from '@/launch/components/card'
import useCoin from '@/launch/hooks/coin'
import { usd, glc, eth, gleth, coinShow } from "@/launch/components/coinShow"

export default function GreatCoin({children, isEth, title}) {

    const { GreatCoinContractAddress, GreatEthContractAddress, CoinList } = useAddress();
    const coinAddr = isEth ? GreatEthContractAddress : GreatCoinContractAddress;
    const coinList = getCoinListByIsEth(isEth, CoinList);

    const [coinTotal, setCoinTotal] = useState(0n)
    const [baseCoinBalance, setBaseCoinBalance] = useState([])
    const [baseCoinTotalBalance, setBaseCoinTotalBalance] = useState(0n)

    const { getBalance, totalSupply } = useCoin()

    const getAmountWithDecimals = (amount, decimals) => {
        return amount * 10n ** BigInt(GreatCoinDecimals - decimals)
    }

    const coinTitle = isEth ? "GreatLotto Eth Coin" : "GreatLotto Coin";
    
    const getCoinsData = async () => {

        let baseCoin = []
        let baseCoinTotal = 0n;
        
        await Promise.all(coinList.map(async (name)=>{
            if(name =='GLC' || name =='GLETH'){
                let total = await totalSupply(coinAddr);
                setCoinTotal(total)
            }else{
                let balance = await getBalance(coinAddr, CoinList[name].address);
                baseCoin.push({ name, balance });
                baseCoinTotal += getAmountWithDecimals(balance, CoinList[name].decimals);
                //console.log(baseCoinTotal)
            }
        }))

        setBaseCoinBalance(baseCoin);
        setBaseCoinTotalBalance(baseCoinTotal);
    }

    const getCoinEl = (coinName, value) => {
        return (<>Base {coinName} Balance: {coinShow(coinName, value)}</>)
    }

    useEffect(()=>{

        console.log('useEffect~')
        getCoinsData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <Card title={title ?? coinTitle} reload={getCoinsData}>
            <p className="card-text mb-1">{coinTitle} Total Supply: {isEth ? gleth(coinTotal) : glc(coinTotal)}</p>
            <p className="card-text mb-1">Base Coin Total Balance: {isEth ? eth(baseCoinTotalBalance) : usd(baseCoinTotalBalance)} </p>
            {baseCoinBalance.map(item => 
            <p key={item.name} className="card-text mb-1">{getCoinEl(item.name, item.balance)}</p>
            )}

            {Children.map(children, child => {
                if(isValidElement(child)){
                    return cloneElement(child, {coinTotal, baseCoinTotalBalance, isEth});
                }
            })}

        </Card>
    </>

  )
}

