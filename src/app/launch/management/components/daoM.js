'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import {isAddress} from 'viem'
import { DaoCoinDecimals, formatAmount, parseAmount } from '@/launch/hooks/globalVars'
import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'

export default function DaoManagement() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const [total, setTotal] = useState(0)
    const [disShare, setDisShare] = useState(0)
    const mintAmountEl = useRef(null)
    const mintAddressEl = useRef(null)

    const { mint, totalSupply, getDistributableShares, error, setError, isLoading, isSuccess } = useDaoCoin()

    const getTotalSupply = async () => {
        let t = await totalSupply()
        setTotal(t)
        return t;
    }

    const getDisShare = async () => {
        let share = await getDistributableShares()
        setDisShare(share)
        return share;
    }

    const mintExecute = async () => {
        let amount = mintAmountEl.current.value;
        let addr = mintAddressEl.current.value;
        amount = parseAmount(amount, DaoCoinDecimals);
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
        getTotalSupply()
        getDisShare()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, publicClient])

  return (
    <>

        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">Dao Coin Mint:</h5>
                <p className="card-text mb-1">Total Supply: {formatAmount(total, DaoCoinDecimals)} GLDC</p>
                <p className="card-text">Distributable Shares: {formatAmount(disShare, DaoCoinDecimals)} GLDC</p>
                <div className="input-group mb-1">
                    <input type="text" className="form-control w-25" placeholder='To Address...' ref={mintAddressEl}/>
                    <input type="number" className="form-control" placeholder='Amount...' ref={mintAmountEl}/>
                    <button type="button" disabled={!!isLoading} className='btn btn-primary'  onClick={()=>{mintExecute()}}> Mint {isLoading ? '...' : ''}</button>
                </div>
                {isSuccess && (
                    <p className="card-text text-success">Success!</p>
                )}
            </div>
        </div>

    </>

  )
}

