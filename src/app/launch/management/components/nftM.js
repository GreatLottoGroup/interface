'use client';

import { useState, useEffect, useRef } from 'react'
import {isAddress} from 'viem'
import useGreatLottoNft from '@/launch/hooks/contracts/GreatLottoNft'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'

export default function NftManagement() {

    const [svgAddress, setSvgAddress] = useState('')
    const svgAddressEl = useRef(null)

    const { getNFTSVGAddress, changeNFTSVGAddress, isLoading, isPending } = useGreatLottoNft()

    
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
    }, [])

  return (
    <>
        <Card title="Change NFT SVG Contract" reload={getSvgAddress}>
            <p className="card-text">SVG Contract Address: {svgAddress}</p>
            <div className="input-group mb-1">
                <input type="text" className="form-control" placeholder='New Address...' ref={svgAddressEl}/>
                <WriteBtn action={changeNFTSVGAddressExecute} isLoading={isLoading || isPending} > Change </WriteBtn>
            </div>
        </Card>

    </>

  )
}

