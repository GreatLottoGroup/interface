'use client';

import { useState, useEffect, useRef, useContext } from 'react'
import { useAccount, useConfig } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { parseAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import useGreatLottoEth from '@/launch/hooks/contracts/GreatLottoEth'
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'
import { eth } from "@/launch/components/coinShow"

import { Stack, TextField, Typography, ButtonGroup } from '@mui/material'

export default function WrapEthCoin({setCoinBalance}) {

    const { address: accountAddress } = useAccount()
    const config = useConfig();

    const { GreatEthContractAddress } = useAddress();
    const setGlobalToast = useContext(SetGlobalToastContext)

    const [ethBalance, setEthBalance] = useState(0)
    const [ethPool, setEthPool] = useState(0)

    const { wrap, unwrap, getBalance: getCoinBalance, isLoading, isPending } = useGreatLottoEth()
    
    const wrapAmountEl = useRef(null);
    const unwrapAmountEl = useRef(null);

    const getEthBalance = async () => {
        let balance = await getBalance(config, {
            address: GreatEthContractAddress
        });
        console.log(balance)
        setEthPool(balance?.value)
    }

    const getEthPool = async () => {
        let balance = await getBalance(config, {
            address: accountAddress
        });
        console.log(balance)
        setEthBalance(balance?.value)
    }

    const wrapExecute = async () => {
        let wrapAmount = wrapAmountEl.current.value || 0;

        if(!wrapAmount || wrapAmount < 0){
            setGlobalToast({
                status: 'error',
                subTitle: 'wrap',
                message: 'Please enter the correct value'
            });
            return false;
        }

        wrapAmount = parseAmount(wrapAmount);

        if(wrapAmount > ethBalance){
            setGlobalToast({
                status: 'error',
                subTitle: 'wrap',
                message: 'Has insufficient Eth balance'
            });
            return false;
        }

        let tx = await wrap(wrapAmount)
        if(tx){
            await getEthBalance();
            await getEthPool();
            setCoinBalance(await getCoinBalance());
            wrapAmountEl.current.value = ''
        }

    }

    const unwrapExecute = async () => {
        let unwrapAmount = unwrapAmountEl.current.value || 0;

        if(!unwrapAmount || unwrapAmount < 0){
            setGlobalToast({
                status: 'error',
                subTitle: 'unwrapAmount',
                message: 'Please enter the correct value'
            });
            return false;
        }

        unwrapAmount = parseAmount(unwrapAmount);

        let coinBalance = await getCoinBalance();

        if(unwrapAmount > coinBalance){
            setGlobalToast({
                status: 'error',
                subTitle: 'unwrapAmount',
                message: 'Account has insufficient balance'
            });
            return false;
        }

        if(unwrapAmount > ethPool){
            setGlobalToast({
                status: 'error',
                subTitle: 'wrap',
                message: 'ETH Pool Has insufficient balance'
            });
            return false;
        }

        let tx = await unwrap(unwrapAmount)
        if(tx){
            await getEthBalance();
            await getEthPool();
            setCoinBalance(await getCoinBalance());
            unwrapAmountEl.current.value = ''
        }

    }
    useEffect(()=>{

        console.log('useEffect~')
        getEthBalance()
        getEthPool()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress])

  return (
    <>
        <Stack spacing={1}>
            <Typography variant="h6" sx={{ mt: 1 }}>Wrap</Typography>
            <Typography variant="subtitle1">ETH Balance: {eth(ethBalance)}</Typography>
            <ButtonGroup fullWidth
                sx={{
                    mt: 2,
                    '& .MuiButtonGroup-grouped': {
                        minWidth: '130px !important',
                        width: 'auto',
                        whiteSpace: 'nowrap'
                    },
                    '& .MuiOutlinedInput-root': {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                    }
                }}     
            >
                <TextField
                    size="small"
                    type="number"
                    label="Amount"
                    inputRef={wrapAmountEl}
                    fullWidth
                />
                <WriteBtn 
                    action={wrapExecute} 
                    isLoading={isLoading || isPending} 
                    variant="outlined"
                > 
                    Wrap From ETH 
                </WriteBtn>
            </ButtonGroup>
        </Stack>

        <Stack spacing={1}>
            <Typography variant="h6">Unwrap</Typography>
            <Typography variant="subtitle1">ETH Pool: {eth(ethPool)}</Typography>
            <ButtonGroup fullWidth
                sx={{
                    mt: 2,
                    '& .MuiButtonGroup-grouped': {
                        minWidth: '130px !important',
                        width: 'auto',
                        whiteSpace: 'nowrap'
                    },
                    '& .MuiOutlinedInput-root': {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                    }
                }}   
            >
                <TextField
                    size="small"
                    type="number"
                    label="Amount"
                    inputRef={unwrapAmountEl}
                    fullWidth
                />
                <WriteBtn 
                    action={unwrapExecute} 
                    isLoading={isLoading || isPending} 
                    variant="outlined"
                > 
                    Unwrap to ETH 
                </WriteBtn>
            </ButtonGroup>
        </Stack>
    </>
  )
}

