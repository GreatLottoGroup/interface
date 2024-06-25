'use client';
import { useContext, useState, useEffect } from 'react';

import  useCoin  from '@/launch/hooks/coin'
import './payCoin.css'

import { parseAmount, getCoinListByIsEth } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'
import usdtABI from '@/abi/usdt_abi.json'
import { coinShow } from "@/launch/components/coinShow"

export function usePayCoin(payCoin, setPayCoin) {

    const { getAllowance, increaseAllowance, getBalance, error, isLoading, isSuccess, isPending, isConfirm } = useCoin();
    const { getApproveSpender, getIsEthCoin } = useAddress();

    const setGlobalToast = useContext(SetGlobalToastContext)

    const updatePayCoin = async (t) => {
        let allowance, balance;
        let newPayCoin = {...payCoin};

        if(!t || t == 'allowance'){
            allowance = await getAllowance(getApproveSpender(payCoin.name), payCoin.address);
            newPayCoin.allowance = allowance;
        }
        if(!t || t == 'balance'){
            balance = await getBalance(null, payCoin.address);
            newPayCoin.balance = balance
        }

        setPayCoin(newPayCoin)
        return [balance, allowance]
    }

    const payExecute = async (payAction, payPermitAction, payAmount) => {
        let _isEth = getIsEthCoin(payCoin.address);
        if(!_isEth){
            payAmount = parseAmount(payAmount, payCoin.decimals);
        }

        // balance
        if(payCoin.balance < payAmount){
            setGlobalToast({
                status: 'error',
                subTitle: 'pay',
                message: 'balance is not enough'
            })
            return false;
        }

        let txPay;
        if(payCoin.allowance >= payAmount){
            // pay
            txPay = await payAction(payCoin, payAmount);
        }else{
            //console.log(payCoin.isPermit)
            if(payCoin.isPermit){
                // permit
                // pay by permit
                txPay = await payPermitAction(payCoin, payAmount)
            }else{
                // allowance
                let val = payCoin.balance;
                let abi;
                if(payCoin.name == 'USDT'){
                    abi = usdtABI;
                    if(payCoin.allowance > 0n){
                        val = 0n;
                    }
                }
                let tx = await increaseAllowance(getApproveSpender(payCoin.name), val, payCoin.address, abi)
                if(tx){
                    let [, _a] = await updatePayCoin('allowance')
                    if(_a < payAmount){
                        setGlobalToast({
                            status: 'error',
                            subTitle: 'pay',
                            message: 'allowance is not enough, please try again'
                        })
                        return false;
                    }    
                }else{
                    return false;
                }
                // pay
                txPay = await payAction(payCoin, payAmount);
            }
        }

        if(txPay){
            await updatePayCoin()
        }else{
            console.log('error---');
        }

        return txPay;
    }


    return {
        updatePayCoin,
        payExecute, 

        error,
        isLoading,
        isSuccess,
        isPending,
        isConfirm
    }
}

export function PayCoin({payCoin, setPayCoin, setCurrentBlock, isEth, setIsEth}) {

    const { getAllowance, increaseAllowance, getBalance, isLoading, isPending } = useCoin();
    const { getApproveSpender, CoinList, getIsEthCoin } = useAddress();
    
    const [coinList, setCoinList] = useState([]);

    const getCoinList = (isEth) => {
        let list = getCoinListByIsEth(isEth, CoinList);
        setCoinList(list);
    }

    const changeCoin = async (coin) => {
        if(!coin){
            setPayCoin({});
        }else{
            let coinData = {...CoinList[coin]}
            coinData.name = coin

            let allowance = await getAllowance(getApproveSpender(coin), coinData.address)

            coinData.allowance = allowance

            let balance = await getBalance(null, coinData.address)
            coinData.balance = balance

            setPayCoin(coinData);
            if(setIsEth){
                setIsEth(getIsEthCoin(coinData.name));
            }
        }
    }

    const increaseCoinAllowance = async () => {
        let val = payCoin.balance;
        let abi;
        if(payCoin.name == 'USDT'){
            abi = usdtABI;
            if(payCoin.allowance > 0n){
                val = 0n;
            }
        }
        let approveSpender = getApproveSpender(payCoin.name);
        let tx = await increaseAllowance(approveSpender, val, payCoin.address, abi)
        if(tx){
            let newCoin = {...payCoin};
            newCoin.allowance = await getAllowance(approveSpender, payCoin.address)
            setPayCoin(newCoin) 
            setCurrentBlock()
        }
    }

    useEffect(() => {

        console.log('useEffect~')
        getCoinList(isEth);  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='col me-3'>
                {setIsEth && (
                    <>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" checked={!isEth} id="coinTypeStable" onChange={(e)=>{
                                setIsEth(false);
                                getCoinList(false);
                            }}/>
                            <label className="form-check-label" htmlFor="coinTypeStable">Stable Coin</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" checked={isEth} id="coinTypeEth" onChange={(e)=>{
                                setIsEth(true);
                                getCoinList(true);
                            }}/>
                            <label className="form-check-label" htmlFor="coinTypeEth">ETH Coin</label>
                        </div>
                    </>
                )}

                <select className="form-select mb-3 mt-2" onChange={(e) =>{changeCoin(e.target.value)}}>
                    <option value=''>Select Coin...</option>
                    {coinList.map(name =>
                        <option key={name} value={name}>{name}</option>
                    )}
                </select>

                {(payCoin.name == 'DAI' || payCoin.name == 'USDC' || payCoin.name == 'GLC' || payCoin.name == 'GLETH') && (payCoin?.allowance < payCoin?.balance) && (
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={payCoin?.isPermit} id="permitPayCheck" onChange={(e)=>{
                            let coinData = {...payCoin}
                            coinData.isPermit = e.target.checked
                            //console.log(coinData)
                            setPayCoin(coinData)
                        }}/>
                        <label className="form-check-label" htmlFor="permitPayCheck">Permit Pay</label>
                    </div>
                )}

            </div>
            <div className='col-6 overflow-hidden'>
                {payCoin?.name && (
                <>
                    <div className='mb-1'>Balance: {coinShow(payCoin.name, payCoin.balance, null, payCoin.address)}</div>
                    <div className='mb-1'>Allowance: {coinShow(payCoin.name, ((payCoin?.allowance > payCoin?.balance) ? payCoin?.balance : payCoin?.allowance), null, payCoin.address)}</div>

                    {(payCoin?.allowance < payCoin?.balance) && (!payCoin?.isPermit) && (
                        <WriteBtn action={increaseCoinAllowance} isLoading={isLoading || isPending} className="btn-outline-success btn-sm me-4 increaseBtn"> Increase Allowance </WriteBtn>
                    )}
                </>
                )}
            </div>
        </>
    )

}