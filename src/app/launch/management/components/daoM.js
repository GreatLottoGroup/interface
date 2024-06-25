'use client';

import { useState, useEffect, useRef, useContext } from 'react'
import {isAddress} from 'viem'
import { parseAmount } from '@/launch/hooks/globalVars'
import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'
import { gldc } from "@/launch/components/coinShow"

export default function DaoManagement() {

    const [total, setTotal] = useState(0)
    const [disShare, setDisShare] = useState(0)
    const mintAmountEl = useRef(null)
    const mintAddressEl = useRef(null)
    const setGlobalToast = useContext(SetGlobalToastContext)

    const { mint, getDistributableShares, isLoading, isPending, totalSupply } = useDaoCoin()

    const initData = async () => {
        setTotal(await totalSupply())
        setDisShare(await getDistributableShares())
    }

    const mintExecute = async () => {
        let amount = mintAmountEl.current.value;
        let addr = mintAddressEl.current.value;
        amount = parseAmount(amount);
        //console.log(amount)
        //console.log(disShare)
        if(amount <= disShare && isAddress(addr)){
            let tx = await mint(addr, amount)
            if(tx){
                mintAmountEl.current.value = '';
                mintAddressEl.current.value = '';
                initData()
            }
        }else{
            setGlobalToast({
                status: 'error',
                subTitle: 'mint',
                message: 'Please enter the correct value & address'
            })
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
            <p className="card-text mb-1">Total Supply: {gldc(total)}</p>
            <p className="card-text">Distributable Shares: {gldc(disShare)}</p>
            <div className="input-group mb-1">
                <input type="text" className="form-control w-25" placeholder='To Address...' ref={mintAddressEl}/>
                <input type="number" className="form-control" placeholder='Amount...' ref={mintAmountEl}/>
                <WriteBtn action={mintExecute} isLoading={isLoading || isPending} > Mint </WriteBtn>
            </div>

        </Card>

    </>

  )
}

