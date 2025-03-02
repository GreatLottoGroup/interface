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

import { Stack, TextField, Typography, ButtonGroup } from '@mui/material'

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
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <Typography variant="subtitle1">
                        Max Redeem: 
                        {isEth ? glieth(maxShares, true) : glic(maxShares, true)}
                        <span className="mx-2">/</span>
                        {isEth ? eth(maxAssets, true) : usd(maxAssets, true)}
                    </Typography>
                    <Typography variant="subtitle1">
                        Redeem Value: 
                        {isEth ? glieth(valueByAssets, true) : glic(valueByAssets, true)} 
                        <Typography component="span" color="text.secondary"> per {isEth ? 'ETH' : 'USD'}</Typography>
                        <span className="mx-2">/</span>
                        {isEth ? eth(valueByShare, true) : usd(valueByShare, true)}  
                        <Typography component="span" color="text.secondary"> per {isEth ? 'GLIETH' : 'GLIC'}</Typography>
                    </Typography>
                </Stack>

                <ButtonGroup fullWidth
                    sx={{
                        mt: 2,
                        '& .MuiButtonGroup-grouped': {
                            minWidth: '150px !important',
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
                        label="Shares"
                        inputRef={redeemAmountEl}
                        onChange={(e) => {
                            updateRedeemAssets(e.target.value)
                        }}
                        fullWidth
                    />
                    <WriteBtn 
                        action={redeemExecute} 
                        isLoading={isLoading || isPending} 
                        variant="outlined"
                    > 
                        Redeem ( {redeemShares} ) 
                    </WriteBtn>
                </ButtonGroup>
                <Typography variant="subtitle1">
                    Assets: {withdrawAssets} * 90% = {isEth ? eth(Number(withdrawAssets) * 0.9, true) : usd(Number(withdrawAssets) * 0.9, true)}
                </Typography>
            </Stack>
        </Card>
    </>
  )
}

