'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import {isAddress} from 'viem'
import useGreatLottoNft from '@/launch/hooks/contracts/GreatLottoNft'

export default function NftManagement() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const [svgAddress, setSvgAddress] = useState('')
    const svgAddressEl = useRef(null)

    const { getNFTSVGAddress, changeNFTSVGAddress, error, setError, isLoading, isSuccess } = useGreatLottoNft()

    
    const getSvgAddress = async () => {
        let addr = await getNFTSVGAddress()
        setSvgAddress(addr);
    }

    const changeNFTSVGAddressExecute = async () => {
        let addr = svgAddressEl.current.value;
        if(!isAddress(addr)){
            return false;
        }
        let tx = await changeNFTSVGAddress(addr);
        if(tx){
            getSvgAddress()
            svgAddressEl.current.value = ''
        }
    }


    useEffect(()=>{

        console.log('useEffect~')
        getSvgAddress()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, publicClient])

  return (
    <>

        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">Change NFT SVG Contract:</h5>
                <p className="card-text">SVG Contract Address: {svgAddress}</p>
                <div className="input-group mb-1">
                    <input type="text" className="form-control" placeholder='New Address...' ref={svgAddressEl}/>
                    <button type="button" disabled={!!isLoading} className='btn btn-primary'  onClick={()=>{changeNFTSVGAddressExecute()}}> Change {isLoading ? '...' : ''}</button>
                </div>
                {isSuccess && (
                    <p className="card-text text-success">Success!</p>
                )}
            </div>
        </div>

    </>

  )
}

