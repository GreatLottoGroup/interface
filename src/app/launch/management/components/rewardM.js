'use client';

import { useState, useEffect, useRef, useContext } from 'react'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { amount, gwei, usd, rate } from "@/launch/components/coinShow"
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'

import useAddress from "@/launch/hooks/address"
import useEstimateCost from '@/launch/hooks/estimateCost'
import useEtherscan from '@/launch/hooks/etherscan'

export default function RewardManagement() {

    const [greatLottoRewardPrice, setGreatLottoRewardPrice] = useState(0)
    const [greatLottoGasGap, setGreatLottoGasGap] = useState(0)
    const [daoBenefitPoolRewardPrice, setDaoBenefitPoolRewardPrice] = useState(0)
    const [daoBenefitPoolGasGap, setDaoBenefitPoolGasGap] = useState(0)
    const [investmentBenefitPoolRewardPrice, setInvestmentBenefitPoolRewardPrice] = useState(0)
    const [investmentBenefitPoolGasGap, setInvestmentBenefitPoolGasGap] = useState(0)

    const [gasPrice, setGasPrice] =  useState(0)
    const [ethPrice, setEthPrice] =  useState(0)

    const greatLottoPriceEl = useRef(null)
    const greatLottoGasGapEl = useRef(null)
    const daoPriceEl = useRef(null)
    const daoGasGapEl = useRef(null)
    const investmentPriceEl = useRef(null)
    const investmentGasGapEl = useRef(null)

    const setGlobalToast = useContext(SetGlobalToastContext)

    const { getGasPrice, getExecutorGasGap, getExecutorRewardPrice, changeExecutorGasGap, changeExecutorRewardPrice, isLoading, isPending } = useEstimateCost()

    const { GreatLottoContractAddress, DaoBenefitPoolContractAddress, InvestmentBenefitPoolContractAddress } = useAddress();

    const { getEthPrice } = useEtherscan();

    const initData = async () => {

        setGreatLottoRewardPrice(await getExecutorRewardPrice(GreatLottoContractAddress))
        setDaoBenefitPoolRewardPrice(await getExecutorRewardPrice(DaoBenefitPoolContractAddress))
        setInvestmentBenefitPoolRewardPrice(await getExecutorRewardPrice(InvestmentBenefitPoolContractAddress))

        setGreatLottoGasGap(await getExecutorGasGap(GreatLottoContractAddress))
        setDaoBenefitPoolGasGap(await getExecutorGasGap(DaoBenefitPoolContractAddress))
        setInvestmentBenefitPoolGasGap(await getExecutorGasGap(InvestmentBenefitPoolContractAddress))

        setGasPrice(await getGasPrice());
        setEthPrice((await getEthPrice())?.ethusd);
    }

    const showChangeBtn = (tips, func, el, addr) => {
        return (
            <div className='col'>
                <div className="input-group">
                    <input type="number" className="form-control" placeholder={tips + '...'} ref={el}/>
                    <WriteBtn action={()=>{
                        changeExecutorExecute(func, addr, el);
                    }} isLoading={isLoading || isPending} > Change </WriteBtn>
                </div>
            </div>
        )
    }

    const showRewardPrice = (title, data, el, addr) => {
        return (
            <div className="row mb-2">
                <div className='card-text col'>{title}: {amount(data, true)} {rate(getPriceGap(data))}</div>
                {showChangeBtn('Reward Price', changeExecutorRewardPrice, el, addr)}
            </div>
        )
    }

    const getPriceGap = (rewardPrice) => {
        rewardPrice = Number(rewardPrice);
        let _ethPrice = Number(ethPrice)
        if(_ethPrice > 0){
            return ((rewardPrice - _ethPrice) / _ethPrice * 100).toFixed(2);
        }else{
            return 0;
        }
    }

    const showGasGap = (title, data, el, addr) => {
        return (
            <div className="row mb-2">
                <div className='card-text col'>{title}: {amount(data, true)}</div>
                {showChangeBtn('Gas Gap', changeExecutorGasGap, el, addr)}
            </div>
        )
    }


    const changeExecutorExecute = async (func, addr, el) => {
        let amount = el.current.value;
        amount = BigInt(parseInt(Number(amount)))
        console.log(amount)
        if(amount <= 0n){
            setGlobalToast({
                status: 'error',
                subTitle: 'change',
                message: 'Please enter the correct value'
            });
            return false;
        }
        let tx = await func(addr, amount)
        if(tx){
            el.current.value = '';
            initData()
        }
    }


    useEffect(()=>{

        console.log('useEffect~')
        initData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <Card title="Reward Key Parameters Set" reload={initData}>
            <p className="card-text">Gas Price: {gwei(gasPrice)}</p>
            <p className="card-text">Eth Price: {usd(ethPrice, true)}</p>

            <p className="card-text mt-3"><strong>Executor Reward Price</strong></p>
            {showRewardPrice('GreatLotto', greatLottoRewardPrice, greatLottoPriceEl, GreatLottoContractAddress)}
            {showRewardPrice('DaoBenefitPool', daoBenefitPoolRewardPrice, daoPriceEl, DaoBenefitPoolContractAddress)}
            {showRewardPrice('In.BenefitPool', investmentBenefitPoolRewardPrice, investmentPriceEl, InvestmentBenefitPoolContractAddress)}

            <p className="card-text mt-3"><strong>Executor Gas Gap</strong></p>
            {showGasGap('GreatLotto', greatLottoGasGap, greatLottoGasGapEl, GreatLottoContractAddress)}
            {showGasGap('DaoBenefitPool', daoBenefitPoolGasGap, daoGasGapEl, DaoBenefitPoolContractAddress)}
            {showGasGap('In.BenefitPool', investmentBenefitPoolGasGap, investmentGasGapEl, InvestmentBenefitPoolContractAddress)}
        </Card>

    </>

  )
}

