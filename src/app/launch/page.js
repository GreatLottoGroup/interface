'use client';

import { useState, useEffect } from 'react'
import { usePublicClient, erc20ABI } from 'wagmi'
import { formatUnits } from 'viem'

import { PrizePoolContractAddress, GreatCoinContractAddress, GuaranteePoolContractAddress, GreatCoinDecimals } from '@/launch/hooks/globalVars'

import PrizePoolContractABI from '@/abi/PrizePool.json'

import './page.css'


export default function Overview() {

    const publicClient = usePublicClient()

    const [prizePoolBalance, setPrizePoolBalance] = useState()
    const [guaranteePoolBalance, setGuaranteePoolBalance] = useState()
    const [rollupPoolBalance, setRollupPoolBalance] = useState()
    

    const getPrizePoolBalance = async () => {
        let data = await publicClient.readContract({
            address: GreatCoinContractAddress,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [PrizePoolContractAddress]
        })
        data = formatUnits(data, GreatCoinDecimals);
        console.log(data)
        return data;
    }

    const getGuaranteePoolBalance = async () => {
        let data = await publicClient.readContract({
            address: GreatCoinContractAddress,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [GuaranteePoolContractAddress]
        })
        data = formatUnits(data, GreatCoinDecimals);
        console.log(data)
        return data;
    }

    const getRollupPoolBalance = async () => {
        let data = await publicClient.readContract({
            address: PrizePoolContractAddress,
            abi: PrizePoolContractABI,
            functionName: 'getRollupBalance'
        })
        data = formatUnits(data, GreatCoinDecimals);
        console.log(data)
        return data;
    }


    const initInfo = async () => {
        
        setPrizePoolBalance(await getPrizePoolBalance());
        setGuaranteePoolBalance(await getGuaranteePoolBalance());
        setRollupPoolBalance(await getRollupPoolBalance());

    }


    useEffect(()=>{

        initInfo()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicClient])


  return (
    <>

        <div className='border px-3 py-3 mb-3 row'>

            <div className='col'>
                <div>Prize Pool Balance: <strong className='ms-2'>{prizePoolBalance} $</strong></div>
                <div>Guarantee Pool Balance: <strong className='ms-2'>{guaranteePoolBalance} $</strong></div>
                <div>Rollup Pool Balance: <strong className='ms-2'>{rollupPoolBalance} $</strong></div>



            </div>

        </div>
        <div className='px-3 py-3 mb-3 row'>
            <div className='col'>
                <a className='btn btn-secondary' onClick={()=>{initInfo()}}>Reload</a>

            </div>

        </div>

    </>

  )
}

