'use client';

import { useState, useEffect, useRef, useContext } from 'react'
import { useAccount } from 'wagmi'
import { InvestmentMinRedeemShares, parseAmount } from '@/launch/hooks/globalVars'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import useInvestmentCoinBase from '@/launch/hooks/contracts/base/InvestmentCoinBase'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'
import { glic, usd, glieth, eth } from "@/launch/components/coinShow"
import useAddress from "@/launch/hooks/address"

export default function Redeem({isEth, setCurrentBlock}) {

    const { address: accountAddress } = useAccount()
    const setGlobalToast = useContext(SetGlobalToastContext)

    const { InvestmentCoinContractAddress, InvestmentEthContractAddress, GreatCoinContractAddress, GreatEthContractAddress } = useAddress()
    const coinAddr = isEth ? InvestmentEthContractAddress: InvestmentCoinContractAddress;

    const [valueByAssets, setValueByAssets] = useState(0)
    const [valueByShare, setValueByShare] = useState(0)
    const [maxAssets, setMaxAssets] = useState(0)
    const [maxShares, setMaxShares] = useState(0)

    const [withdrawAssets, setWidthAssets] = useState(0)
    const [redeemShares, setRedeemShares] = useState(0)

    const redeemAmountEl = useRef(null)

    const { investmentRedeem, isLoading, isPending } = usePrizePool()
    const { maxRedeem, maxWithdraw, previewRedeem, previewWithdraw, totalSupply } = useInvestmentCoinBase(coinAddr)

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
        //console.log(value)
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
        let coin = isEth ? GreatEthContractAddress : GreatCoinContractAddress;
        if(redeemShares >= InvestmentMinRedeemShares && redeemShares <= Number(maxShares)){
            let _redeemShares = parseAmount(redeemShares);
            redeemTx = await investmentRedeem(coin, _redeemShares)
        }else{
            setGlobalToast({
                status: 'error',
                subTitle: 'redeem',
                message: 'Please enter the correct value'
            })
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
        <Card title={"Redeem with " + (isEth ? 'Eth Coin' : 'Standard Coin')} reload={initData}>
            <p className="card-text mb-1">Max Redeem: 
                {isEth ? glieth(maxShares, true) : glic(maxShares, true)}
                <span className="mx-2">/</span>
                {isEth ? eth(maxAssets, true) : usd(maxAssets, true)}
            </p>
            <p className="card-text mb-3">Redeem Value: 
                {isEth ? glieth(valueByAssets, true) : glic(valueByAssets, true)} <span className="text-body-tertiary"> per {isEth ? 'ETH' : 'USD'}</span>
                <span className="mx-2">/</span>
                {isEth ? eth(valueByShare, true) : usd(valueByShare, true)}  <span className="text-body-tertiary"> per {isEth ? 'GLIETH' : 'GLIC'}</span>
            </p>
            <div className='row'>
                <div className='col me-3'>
                    <div className="input-group">
                        <span className="input-group-text">Shares</span>
                        <input type="number" className="form-control w-50" ref={redeemAmountEl} onChange={(e)=>{
                            updateRedeemAssets(e.currentTarget.value)
                        }}/>
                    </div>
                    <p className="card-text mx-0 mt-2">
                        <>Assets: {withdrawAssets} * 90% = {isEth ? eth(Number(withdrawAssets) * 0.9, true) : usd(Number(withdrawAssets) * 0.9, true)}</>
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

