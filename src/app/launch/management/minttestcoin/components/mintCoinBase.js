'use client';

import { useRef, useContext } from 'react'
import {isAddress} from 'viem'
import { parseAmount } from '@/launch/hooks/globalVars'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'

import { useAccount } from 'wagmi'
import GreatCoinABI from '../abi/GreatLottoCoinTest'
import  useWrite  from '@/launch/hooks/write';

export default function MintCoinBase({coinAddress, coinName}) {

    const mintAmountEl = useRef(null)
    const mintAddressEl = useRef(null)
    const burnAmountEl = useRef(null)
    const burnAddressEl = useRef(null)
    const setGlobalToast = useContext(SetGlobalToastContext)

    const { address: accountAddress } = useAccount()
    const { write, isLoading, isPending} = useWrite()

    const mintFor = async (addr, amount) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: coinAddress,
            abi: GreatCoinABI,
            functionName: 'mintFor',
            args: [addr, amount],
        })
        return tx;
    }

    const burnFrom = async (addr, amount) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: coinAddress,
            abi: GreatCoinABI,
            functionName: 'burnFrom',
            args: [addr, amount],
        })
        return tx;
    }


    const mintExecute = async () => {
        let amount = mintAmountEl.current.value;
        let addr = mintAddressEl.current.value;
        amount = parseAmount(amount);
        if(amount > 0n && isAddress(addr)){
            let tx = await mintFor(addr, amount)
            if(tx){
                mintAmountEl.current.value = '';
                mintAddressEl.current.value = '';
            }
        }else{
            setGlobalToast({
                status: 'error',
                subTitle: 'mint',
                message: 'Please enter the correct value & address'
            })
        }
    }

    const burnExecute = async () => {
        let amount = burnAmountEl.current.value;
        let addr = burnAddressEl.current.value;
        amount = parseAmount(amount);
        if(amount > 0n && isAddress(addr)){
            let tx = await burnFrom(addr, amount)
            if(tx){
                burnAmountEl.current.value = '';
                burnAddressEl.current.value = '';
            }
        }else{
            setGlobalToast({
                status: 'error',
                subTitle: 'burn',
                message: 'Please enter the correct value & address'
            })
        }
    }

  return (
    <>
        <Card title={'Mint Test ' + coinName} className="mb-3">
            <div className="input-group mb-1">
                <input type="text" className="form-control w-25" placeholder='To Address...' ref={mintAddressEl}/>
                <input type="number" className="form-control" placeholder='Amount...' ref={mintAmountEl}/>
                <WriteBtn action={mintExecute} isLoading={isLoading || isPending} > Mint </WriteBtn>
            </div>
        </Card>

        <Card title={'Burn Test ' + coinName}>
            <div className="input-group mb-1">
                <input type="text" className="form-control w-25" placeholder='To Address...' ref={burnAddressEl}/>
                <input type="number" className="form-control" placeholder='Amount...' ref={burnAmountEl}/>
                <WriteBtn action={burnExecute} isLoading={isLoading || isPending} > Burn </WriteBtn>
            </div>
        </Card>

    </>

  )

}

