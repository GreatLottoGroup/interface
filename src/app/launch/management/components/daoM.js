'use client';

import { useState, useEffect, useRef } from 'react'
import {isAddress} from 'viem'
import { formatAmount, parseAmount } from '@/launch/hooks/globalVars'
import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'

export default function DaoManagement() {

    const [total, setTotal] = useState(0)
    const [disShare, setDisShare] = useState(0)
    const mintAmountEl = useRef(null)
    const mintAddressEl = useRef(null)

    const { mint, totalSupply, getDistributableShares, isLoading } = useDaoCoin()

    const initData = async () => {
        setTotal(await totalSupply())
        setDisShare(await getDistributableShares())
    }

    const mintExecute = async () => {
        let amount = mintAmountEl.current.value;
        let addr = mintAddressEl.current.value;
        amount = parseAmount(amount);
        console.log(amount)
        console.log(disShare)
        if(amount <= disShare && isAddress(addr)){
            let tx = await mint(addr, amount)
            if(tx){
                mintAmountEl.current.value = '';
                mintAddressEl.current.value = '';
                getTotalSupply()
                getDisShare()
            }
        }else{
            console.log('error---')
        }
    }

    useEffect(()=>{

        console.log('useEffect~')
        initData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <Card title="Dao Coin Mint" reload={initData}>
            <p className="card-text mb-1">Total Supply: {formatAmount(total)} GLDC</p>
            <p className="card-text">Distributable Shares: {formatAmount(disShare)} GLDC</p>
            <div className="input-group mb-1">
                <input type="text" className="form-control w-25" placeholder='To Address...' ref={mintAddressEl}/>
                <input type="number" className="form-control" placeholder='Amount...' ref={mintAmountEl}/>
                <WriteBtn action={mintExecute} isLoading={isLoading} > Mint </WriteBtn>
            </div>

        </Card>

    </>

  )
}

