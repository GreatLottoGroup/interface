'use client';

import { useState, useEffect, useRef, useContext } from 'react'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { usd, eth } from "@/launch/components/coinShow"
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'
import { parseAmount } from '@/launch/hooks/globalVars'

import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'
import useInvestmentCoin from '@/launch/hooks/contracts/InvestmentCoin'
import useInvestmentEth from '@/launch/hooks/contracts/InvestmentEth'

export default function GovCoinManagement() {

    const {getInitialPrice: getInitialPriceDao, changeInitialPrice: changeInitialPriceDao, isLoading: isLoadingDao, isPending: isPendingDao} = useDaoCoin();
    const {getInitialPrice: getInitialPriceICoin, changeInitialPrice: changeInitialPriceICoin, isLoading: isLoadingICoin, isPending: isPendingICoin} = useInvestmentCoin();
    const {getInitialPrice: getInitialPriceIEth, changeInitialPrice: changeInitialPriceIEth, isLoading: isLoadingIEth, isPending: isPendingIEth} = useInvestmentEth();

    const [initialPriceDao, setInitialPriceDao] = useState(0)
    const [initialPriceDaoEth, setInitialPriceDaoEth] = useState(0)
    const [initialPriceICoin, setInitialPriceICoin] = useState(0)
    const [initialPriceIEth, setInitialPriceIEth] = useState(0)

    const initialPriceDaoEl = useRef(null)
    const initialPriceDaoEthEl = useRef(null)
    const initialPriceICoinEl = useRef(null)
    const initialPriceIEthEl = useRef(null)

    const setGlobalToast = useContext(SetGlobalToastContext)

    const initData = async () => {

        setInitialPriceDao(await getInitialPriceDao(false));
        setInitialPriceDaoEth(await getInitialPriceDao(true));
        setInitialPriceICoin(await getInitialPriceICoin())
        setInitialPriceIEth(await getInitialPriceIEth())

    }

    const showInitialPrice = (title, data, func, el, isEth, isLoading) => {
        return (
            <div className="row mb-2">
                <div className='card-text col'>{title}: {isEth ? eth(data) : usd(data)}</div>
                {showChangeBtn(func, el, isEth, isLoading)}
            </div>
        )
    }

    const showChangeBtn = (func, el, isEth, isLoading) => {
        return (
            <div className='col'>
                <div className="input-group">
                    <input type="number" className="form-control" placeholder='Initial Price...' ref={el}/>
                    <WriteBtn action={()=>{
                        changeInitialPrice(func, el, isEth);
                    }} isLoading={isLoading} > Change </WriteBtn>
                </div>
            </div>
        )
    }

    const changeInitialPrice = async (func, el, isEth) => {
        let amount = el.current.value;
        amount = parseAmount(amount);
        console.log('InitialPrice: ', amount)
        if(amount <= 0n){
            setGlobalToast({
                status: 'error',
                subTitle: 'changeInitialPrice',
                message: 'Please enter the correct value'
            });
            return false;
        }
        console.log(isEth);
        let tx = await func(amount, isEth)
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
        <Card title="Gov Coin Initial Price Set" reload={initData}>
            <p className="card-text mt-3"><strong>Dao Coin</strong></p>
            {showInitialPrice('Initial Price', initialPriceDao, changeInitialPriceDao, initialPriceDaoEl, false, isLoadingDao || isPendingDao)}
            {showInitialPrice('Initial Price By Eth', initialPriceDaoEth, changeInitialPriceDao, initialPriceDaoEthEl, true, isLoadingDao || isPendingDao)}

            <p className="card-text mt-3"><strong>Investment Coin</strong></p>
            {showInitialPrice('Initial Price', initialPriceICoin, changeInitialPriceICoin, initialPriceICoinEl, false, isLoadingICoin || isPendingICoin)}

            <p className="card-text mt-3"><strong>Investment Eth Coin</strong></p>
            {showInitialPrice('Initial Price', initialPriceIEth, changeInitialPriceIEth, initialPriceIEthEl, true, isLoadingIEth || isPendingIEth)}

        </Card>

    </>

  )
}

