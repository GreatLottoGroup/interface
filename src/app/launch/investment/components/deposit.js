'use client';

import { useState, useEffect, useRef, useContext } from 'react'
import { useAccount } from 'wagmi'
import { InvestmentMinDepositAssets, InvestmentMinDepositAssetsByEth } from '@/launch/hooks/globalVars'

import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import useInvestmentCoinBase from '@/launch/hooks/contracts/base/InvestmentCoinBase'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'

import { PayCoin, usePayCoin } from '@/launch/issue/components/payCoin'
import { glic, usd, glieth, eth } from "@/launch/components/coinShow"
import useAddress from "@/launch/hooks/address"

export default function Deposit({isEth, setCurrentBlock}) {

    const { address: accountAddress } = useAccount()
    const setGlobalToast = useContext(SetGlobalToastContext)

    const { InvestmentCoinContractAddress, InvestmentEthContractAddress } = useAddress()
    const coinAddr = isEth ? InvestmentEthContractAddress: InvestmentCoinContractAddress;

    const [prizeByAssets, setPrizeByAssets] = useState(0)
    const [prizeByShare, setPrizeByShare] = useState(0)
    const [maxAssets, setMaxAssets] = useState(0)
    const [maxShares, setMaxShares] = useState(0)

    const [depositAssets, setDepositAssets] = useState(0)
    const [mintShares, setMintShares] = useState(0)

    const [amountType, setAmountType] = useState('assets')

    const depositAmountEl = useRef(null)

    const [payCoin, setPayCoin] = useState({})

    const { investmentDeposit, investmentDepositWithSign, isLoading, isPending } = usePrizePool()
    const { maxDeposit, maxMint, previewDeposit, previewMint } = useInvestmentCoinBase(coinAddr)
    const { payExecute } = usePayCoin(payCoin, setPayCoin)

    const initData = async () => {

        setMaxAssets(await maxDeposit());
        setMaxShares(await maxMint());

        setPrizeByAssets(await previewDeposit(1))
        setPrizeByShare(await previewMint(1))

    }

    const updateDepositAssets = async (type, value) => {
        //console.log(value)
        if(!value || value <= 0){
            depositAmountEl.current.value = '';
            setDepositAssets(0)
            setMintShares(0)
            return false;
        }
        if(type == 'assets'){
            if(value > Number(maxAssets)){
                value = Number(maxAssets);
                depositAmountEl.current.value = value;
            }
            setDepositAssets(value)
            setMintShares(await previewDeposit(value))
        }else{
            if(value > Number(maxShares)){
                value = Number(maxShares);
                depositAmountEl.current.value = value;
            }
            setMintShares(value)
            setDepositAssets(await previewMint(value))
        }
    }

    const depositExecute = async () => {

        let depositTx;
        let _InvestmentMinDepositAssets = isEth ? InvestmentMinDepositAssetsByEth : InvestmentMinDepositAssets
        if(depositAssets >= _InvestmentMinDepositAssets && depositAssets <= Number(maxAssets) && payCoin && payCoin.name){
            depositTx = await payExecute(async function(){
                return await investmentDeposit(payCoin.address, depositAssets);
            }, async function(){
                return await investmentDepositWithSign(payCoin.address, depositAssets);
            }, depositAssets)
        }else{
            setGlobalToast({
                status: 'error',
                subTitle: 'deposit',
                message: 'Please enter the correct value'
            })
        }
        
        if(depositTx){
            updateDepositAssets()
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
        <Card title={"Deposit with " + (isEth ? 'Eth Coin' : 'Standard Coin')} reload={initData}>
            <p className="card-text mb-1">Max Deposit: 
                {isEth ? eth(maxAssets, true) : usd(maxAssets, true)} 
                <span className="mx-2">/</span>
                {isEth ? glieth(maxShares, true): glic(maxShares, true)}
            </p>
            <p className="card-text mb-3">Deposit Prize: 
                {isEth ? eth(prizeByShare, true) : usd(prizeByShare, true)} <span className="text-body-tertiary"> per {isEth ? 'GLIETH' : 'GLIC'}</span>  
                <span className="mx-2">/</span>
                {isEth ? glieth(prizeByAssets, true) : glic(prizeByAssets, true)} <span className="text-body-tertiary"> per {isEth ? 'ETH' : 'USD'}</span>
            </p>
            <div className='row mb-3'>
                <PayCoin payCoin={payCoin} setPayCoin={setPayCoin} isEth={isEth} setCurrentBlock={setCurrentBlock}/>
            </div>
            <div className='row'>
                <div className='col me-3'>
                    <div className="input-group">
                        <select className='form-select' value={amountType} onChange={(e)=>{
                            let type = e.currentTarget.value;
                            setAmountType(type);
                            updateDepositAssets(type, depositAmountEl.current.value)
                        }}>
                            <option value="assets">Assets</option>
                            <option value="shares">Shares</option>
                        </select>
                        <input type="number" className="form-control w-50" ref={depositAmountEl} onChange={(e)=>{
                            updateDepositAssets(amountType, e.currentTarget.value)
                        }}/>
                    </div>
                    <p className="card-text mx-0 mt-2">
                        {amountType == 'assets' ? (
                            <>Share: {isEth ? glieth(mintShares, true) : glic(mintShares, true)}</>
                        ) : (
                            <>Assets: {isEth ? eth(depositAssets, true) : usd(depositAssets, true)}</>
                        )}
                    </p>
                </div>
                <div className='col-6'>
                    <WriteBtn action={depositExecute} isLoading={isLoading || isPending} >Deposit ( {depositAssets} {payCoin?.name} )</WriteBtn>
                </div>
            </div>

        </Card>

    </>

  )
}

