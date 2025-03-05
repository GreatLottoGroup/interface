'use client';

import { useState, useEffect, useRef, useContext, Children, cloneElement, isValidElement } from 'react'
import { useAccount } from 'wagmi'
import { formatAmount, parseAmount, getCoinListByIsEth } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import useCoin from '@/launch/hooks/coin'
import useGreatLottoCoinBase from '@/launch/hooks/contracts/base/GreatLottoCoinBase'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'
import { glc, gleth } from "@/launch/components/coinShow"

import { Stack, TextField, Select, FormControl, MenuItem, ButtonGroup, Typography, InputLabel } from '@mui/material'

export default function MyCoinBase({isEth, children}) {

    const { address: accountAddress } = useAccount()
    const { GreatCoinContractAddress, GreatEthContractAddress, CoinList, PrizePoolContractAddress } = useAddress();
    const setGlobalToast = useContext(SetGlobalToastContext)

    const [coinBalance, setCoinBalance] = useState(0)
    const [withdrawCoinBalances, setWithdrawCoinBalances] = useState({})

    const { getBalance } = useCoin()
    
    const withdrawAmountEl = useRef(null);
    const withdrawCoinEl = useRef(null);

    const coinAddr = isEth ? GreatEthContractAddress : GreatCoinContractAddress;
    const coinList = getCoinListByIsEth(isEth, CoinList);
    const title = isEth ? 'My GreatLotto Eth Coin' : 'My GreatLotto Coin';

    const { withdraw, isLoading, isPending } = useGreatLottoCoinBase(coinAddr);

    const getCoinBalance = async () => {
        let balance = await getBalance(null, coinAddr)
        setCoinBalance(balance)

        let cList = {};
        for (let i = 0; i < coinList.length; i++) {
            let coin = coinList[i];
            if(coin != 'GLC' && coin != 'GLETH'){
                cList[coin] = await getBalance(PrizePoolContractAddress, CoinList[coin].address);
            }                
        }
        setWithdrawCoinBalances(cList);
    }

    const withdrawExecute = async () => {
        let withdrawAmount = withdrawAmountEl.current.value;
        let withdrawCoinName = withdrawCoinEl.current.value;
        let withdrawCoinAddr = CoinList[withdrawCoinName]?.address;
        let withdrawCoinBalance = withdrawCoinBalances[withdrawCoinName];

        if(!withdrawAmount || withdrawAmount < 0 || !withdrawCoinAddr){
            setGlobalToast({
                status: 'error',
                subTitle: 'withdraw',
                message: 'Please enter the correct value & coin'
            });
            return false;
        }
        if(parseAmount(withdrawAmount) > coinBalance){
            setGlobalToast({
                status: 'error',
                subTitle: 'withdraw',
                message: 'Account has insufficient balance'
            });
            return false;
        }
        if(Number(withdrawAmount) > Number(formatAmount(withdrawCoinBalance, CoinList[withdrawCoinName].decimals))){
            setGlobalToast({
                status: 'error',
                subTitle: 'withdraw',
                message: 'Base coin has insufficient balance'
            });
            return false;
        }

        let tx = await withdraw(withdrawCoinAddr, withdrawAmount)
        if(tx){
            await getCoinBalance()
            withdrawAmountEl.current.value = ''
            withdrawCoinEl.current.value = ''
        }

    }

    useEffect(()=>{

        console.log('useEffect~')
        getCoinBalance()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress])

  return (
    <>
        <Card title={title} reload={getCoinBalance}>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <Typography variant="subtitle1" >Balance: {isEth ? gleth(coinBalance) : glc(coinBalance)}</Typography>

                    <ButtonGroup fullWidth
                        sx={{
                            mt: 2,
                            '& .MuiButtonGroup-grouped': {
                                minWidth: '100px !important',
                                width: 'auto',
                                whiteSpace: 'nowrap'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                            },
                            '& .MuiFormControl-root:not(:first-child)': {
                                marginLeft: '-1px',
                                '& .MuiOutlinedInput-root': {
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                }
                            }
                        }}
                    >
                        <TextField
                            size="small"
                            type="number"
                            label="Amount"
                            inputRef={withdrawAmountEl}
                            fullWidth
                        />
                        <FormControl fullWidth size="small">
                            <InputLabel>Coin</InputLabel>
                            <Select
                                inputRef={withdrawCoinEl}
                                label="Coin"
                            >
                            {Object.keys(withdrawCoinBalances).map(name =>
                                <MenuItem key={name} value={name}>
                                    {name} ({formatAmount(withdrawCoinBalances[name], CoinList[name].decimals)})
                                </MenuItem>
                            )}
                            </Select>
                        </FormControl>
                        <WriteBtn 
                            action={withdrawExecute} 
                            isLoading={isLoading || isPending} 
                            variant="outlined"
                            size="small"
                        >
                            Withdraw
                        </WriteBtn>
                    </ButtonGroup>
                </Stack>
                {Children.map(children, child => {
                    if(isValidElement(child)){
                        return cloneElement(child, {setCoinBalance});
                    }
                })}
            </Stack>
        </Card>
    </>

  )
}

