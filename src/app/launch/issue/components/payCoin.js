'use client';
import { useContext, useState, useEffect } from 'react';
import { useAccount, useConfig } from 'wagmi'

import  useCoin  from '@/launch/hooks/coin'
import './payCoin.css'

import { parseAmount, getCoinListByIsEth } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'
import usdtABI from '@/abi/usdt_abi.json'
import { coinShow, coinIcon } from "@/launch/components/coinShow"

import { Stack, Radio, RadioGroup, FormControlLabel, FormControl, Select, MenuItem, Checkbox, InputLabel, CircularProgress } from '@mui/material';
import { IsMobileContext } from '@/hooks/mediaQueryContext';

const usdtIncreaseAllowance = (abi, val, chainId, allowance) => {
    if(chainId != 11155111){
        abi = usdtABI;
    }
    if(allowance > 0n){
        val = 0n;
    }
    return [abi, val];
}

export function usePayCoin(payCoin, setPayCoin) {

    const { getAllowance, increaseAllowance, getBalance, error, isLoading, isSuccess, isPending, isConfirm } = useCoin();
    const { getApproveSpender, getIsEthCoin } = useAddress();

    const setGlobalToast = useContext(SetGlobalToastContext)

    const config = useConfig();
    const chainId = config.state.chainId;

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
                    [abi, val] = usdtIncreaseAllowance(abi, val, chainId, payCoin.allowance);
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
    const { address: accountAddress } = useAccount()
    const config = useConfig();
    const chainId = config.state.chainId;

    const { getAllowance, increaseAllowance, getBalance, isLoading, isPending } = useCoin();
    const { getApproveSpender, CoinList, getIsEthCoin } = useAddress();
    
    const [coinList, setCoinList] = useState([]);
    const [isSelectLoading, setIsSelectLoading] = useState(false);

    const getCoinList = (isEth) => {
        let list = getCoinListByIsEth(isEth, CoinList);
        setCoinList(list);
     }

    const changeCoin = async (coin) => {
        setIsSelectLoading(true);
        try {
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
        } finally {
            setIsSelectLoading(false);
        }
    }

    const increaseCoinAllowance = async () => {
        let val = payCoin.balance;
        let abi;
        if(payCoin.name == 'USDT'){
            [abi, val] = usdtIncreaseAllowance(abi, val, chainId, payCoin.allowance);
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
        setPayCoin({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress])

    const isMobile = useContext(IsMobileContext);

    return (
        <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={2}
        >
            <Stack sx={{ width: isMobile ? '100%' : '50%' }}>
                {setIsEth && (
                    <FormControl>
                        <RadioGroup
                            row
                            value={isEth}
                            onChange={(e) => {
                                const newValue = e.target.value === 'true';
                                setIsEth(newValue);
                                getCoinList(newValue);
                            }}
                        >
                            <FormControlLabel 
                                value={false} 
                                control={<Radio />} 
                                label="Stable Coin" 
                            />
                            <FormControlLabel 
                                value={true} 
                                control={<Radio />} 
                                label="ETH Coin" 
                            />
                        </RadioGroup>
                    </FormControl>
                )}

                <Stack spacing={isMobile ? 2 : 1} direction={isMobile ? "row" : "column"}>
                    <FormControl sx={{ mt: 3, width: '70%' }} size="small">
                        <InputLabel>Select Coin</InputLabel>
                        <Select
                            value={payCoin.name || ''}
                            onChange={(e) => changeCoin(e.target.value)}
                            label="Select Coin"
                            disabled={isSelectLoading}
                            endAdornment={isSelectLoading && (
                                <CircularProgress 
                                    size={20} 
                                    sx={{ 
                                        position: 'absolute',
                                        right: 25,
                                        top: 'calc(50% - 10px)'
                                    }} 
                                />
                            )}
                        >
                            {coinList.map(name =>
                                <MenuItem key={name} value={name}>
                                    {coinIcon(name)}
                                    {name}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    {payCoin.isPermit && (payCoin?.allowance < payCoin?.balance) && (
                        <FormControlLabel
                            sx={{ width: '30%' }}
                            control={
                                <Checkbox
                                    checked={payCoin?.isPermit || false}
                                    onChange={(e) => {
                                        let coinData = {...payCoin}
                                        coinData.isPermit = e.target.checked
                                        setPayCoin(coinData)
                                    }}
                                />
                            }
                            label="Permit Pay"
                        />
                    )}
                </Stack>
                
            </Stack>

            <Stack sx={{ 
                width: isMobile ? '100%' : '50%', 
                overflow: 'hidden'
            }}>
                {payCoin?.name && (
                    <>
                        <div className='mb-1'>Balance: {coinShow(payCoin.name, payCoin.balance, null, payCoin.address)}</div>
                        <div className='mb-2'>Allowance: {coinShow(payCoin.name, ((payCoin?.allowance > payCoin?.balance) ? payCoin?.balance : payCoin?.allowance), null, payCoin.address)}</div>

                        {(payCoin?.allowance < payCoin?.balance) && (!payCoin?.isPermit) && (
                            <WriteBtn action={increaseCoinAllowance} isLoading={isLoading || isPending} className="increaseBtn" color="success" size="small" variant="outlined"> Increase Allowance </WriteBtn>
                        )}
                    </>
                )}
            </Stack>
        </Stack>
    )
}