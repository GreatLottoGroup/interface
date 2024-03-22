'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { InvestmentMinDepositAssets } from '@/launch/hooks/globalVars'

import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import useInvestmentCoin from '@/launch/hooks/contracts/InvestmentCoin'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'

import { PayCoin, usePayCoin } from '@/launch/issue/components/payCoin'

export default function Deposit({setCurrentBlock}) {

    const { address: accountAddress } = useAccount()


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
    const { maxDeposit, maxMint, previewDeposit, previewMint } = useInvestmentCoin()
    const { payExecute } = usePayCoin(payCoin, setPayCoin)

    const initData = async () => {

        setMaxAssets(await maxDeposit());
        setMaxShares(await maxMint());

        setPrizeByAssets(await previewDeposit(1))
        setPrizeByShare(await previewMint(1))

    }

    const updateDepositAssets = async (type, value) => {
        console.log(value)
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

        if(depositAssets >= InvestmentMinDepositAssets && depositAssets <= Number(maxAssets) && payCoin && payCoin.name){
            depositTx = await payExecute(async function(){
                return await investmentDeposit(payCoin.address, depositAssets);
            }, async function(){
                return await investmentDepositWithSign(payCoin.address, depositAssets);
            }, depositAssets)
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
        <Card title="Deposit" reload={initData}>
            <p className="card-text mb-1">Max Deposit: {maxAssets} USD ( {maxShares} GLIC )</p>
            <p className="card-text mb-3">Deposit Prize: {prizeByShare} USD / GLIC  ( {prizeByAssets} GLIC / USD )</p>
            <div className='row mb-3'>
                <PayCoin payCoin={payCoin} setPayCoin={setPayCoin} setCurrentBlock={setCurrentBlock}/>
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
                    <p className="card-text mx-3 mt-2">
                        {amountType == 'assets' ? (
                            <>Share: {mintShares}</>
                        ) : (
                            <>Assets: {depositAssets}</>
                        )}
                    </p>
                </div>
                <div className='col-6'>
                    <WriteBtn action={depositExecute} isLoading={isLoading || isPending} className="mt-3">Deposit ( {depositAssets} {payCoin?.name} )</WriteBtn>
                </div>
            </div>

        </Card>

    </>

  )
}

