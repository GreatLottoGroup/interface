'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { InvestmentMinRedeemShares } from '@/launch/hooks/globalVars'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import useInvestmentCoin from '@/launch/hooks/contracts/InvestmentCoin'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'

export default function Redeem({setCurrentBlock}) {

    const { address: accountAddress } = useAccount()


    const [valueByAssets, setValueByAssets] = useState(0)
    const [valueByShare, setValueByShare] = useState(0)
    const [maxAssets, setMaxAssets] = useState(0)
    const [maxShares, setMaxShares] = useState(0)

    const [withdrawAssets, setWidthAssets] = useState(0)
    const [redeemShares, setRedeemShares] = useState(0)

    const redeemAmountEl = useRef(null)

    const { investmentRedeem, isLoading, isPending } = usePrizePool()
    const { maxRedeem, maxWithdraw, previewRedeem, previewWithdraw, totalSupply } = useInvestmentCoin()

    const initData = async () => {
        let total = await totalSupply();

        setMaxAssets(await maxWithdraw());
        setMaxShares(await maxRedeem());

        if(total > 0){
            setValueByAssets(await previewWithdraw(1))
            setValueByShare(await previewRedeem(1))
        }

    }

    const updateRedeemAssets = async (value) => {
        console.log(value)
        if(!value || value <= 0){
            redeemAmountEl.current.value = '';
            setWidthAssets(0)
            setRedeemShares(0)
            return false;
        }
        if(value > Number(maxShares)){
            value = Number(maxShares);
            redeemAmountEl.current.value = value;
        }
        setRedeemShares(value)
        setWidthAssets(await previewRedeem(value))
    }

    const redeemExecute = async () => {

        let redeemTx;

        if(redeemShares >= InvestmentMinRedeemShares && redeemShares <= Number(maxShares)){
            redeemTx = await investmentRedeem(redeemShares)
        }
        
        if(redeemTx){
            updateRedeemAssets()
            setCurrentBlock()
            initData()
        }else{
            console.log('error---');
        }

    }

    useEffect(()=>{

        console.log('useEffect~')

        initData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress])

  return (
    <>
        <Card title="Redeem" reload={initData}>
            <p className="card-text mb-1">Max Redeem: {maxShares} GLIC ( {maxAssets} USD )</p>
            <p className="card-text mb-3">Redeem Value: {valueByAssets} GLIC / USD  ( {valueByShare} USD / GLIC )</p>
            <div className='row'>
                <div className='col me-3'>
                    <div className="input-group">
                        <span className="input-group-text">Shares</span>
                        <input type="number" className="form-control w-50" ref={redeemAmountEl} onChange={(e)=>{
                            updateRedeemAssets(e.currentTarget.value)
                        }}/>
                    </div>
                    <p className="card-text mx-3 mt-2">
                        <>Assets: {withdrawAssets} * 90% = {Number(withdrawAssets) * 0.9}</>
                    </p>
                </div>
                <div className='col-6'>
                    <WriteBtn action={redeemExecute} isLoading={isLoading || isPending} > Redeem ( {redeemShares} ) </WriteBtn>
                </div>
            </div>

        </Card>

    </>

  )
}

