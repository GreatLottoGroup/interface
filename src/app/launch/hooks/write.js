'use client';

import { useState } from 'react'
import { useConfig  } from 'wagmi'
import { simulateContract, writeContract, signTypedData, waitForTransactionReceipt, getTransactionReceipt } from '@wagmi/core'
import { hexToSignature } from 'viem'
import { dateFormatLocalWithoutZone} from '@/launch/hooks/dateFormat'
import { useContext } from 'react';
import { SetTransactionContext } from '../hooks/transactionsContext';
import { errorHandle } from '@/launch/hooks/globalVars'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'

export default function useWrite() {

    const config = useConfig();

    const setTransaction = useContext(SetTransactionContext);
    const setGlobalToast = useContext(SetGlobalToastContext)

    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [status, setStatus] = useState('')

    const _errorHandle = (err) => {
        setStatus('error')
        let _err = errorHandle(err);
        setError(_err)
        setGlobalToast({
            status: 'error',
            message: _err?.message ?? _err
        })
    }

    const write = async (req) => {
        setIsLoading(true)
        setIsSuccess(false)
        setIsPending(false)
        setIsConfirm(false)
        setError()
        setStatus('loading')

        console.log(req)

        let trans = {
            action: req.functionName,
            time: dateFormatLocalWithoutZone(new Date().getTime())
        }

        let request
        try {
            ({ request } = await simulateContract(config, req))
        } catch (err) {
            _errorHandle(err);
        }

        let tx;
        if(request){
            try {
                tx = await writeContract(config, request)
            } catch (err) {
                _errorHandle(err);
            }
        }

        console.log(tx);

        setIsLoading(false)
        if(tx){
            setIsPending(true)
            setStatus('pending')
            setTransaction({
                ...trans,
                hash: tx,
                status: 'pending'
            }, [], true)
            setGlobalToast({
                status: 'pending',
                subTitle: 'Waiting for confirmation',
                message: req.functionName
            })
            let transactionReceipt;
            try {
                transactionReceipt = await waitForTransactionReceipt(config, {hash: tx});
            } catch (err) {
                _errorHandle(err);
                transactionReceipt = await getTransactionReceipt(config, {hash: tx})
            }
            setIsPending(false)
            setIsConfirm(true)
            console.log(transactionReceipt)
            setStatus(transactionReceipt.status);
            setTransaction({
                ...trans,
                hash: tx,
                status: transactionReceipt.status
            }, [], true)
            if(transactionReceipt.status == 'success'){
                setGlobalToast({
                    status: 'success',
                    subTitle: 'Transaction Confirmed',
                    message: req.functionName
                })
            }
            }

        return tx;

    }



    const sign = async (req) => {
        setIsLoading(true)
        setIsSuccess(false)
        setError()

        console.log(req)

        let signature
        try {
            signature = await signTypedData(config, req);
        } catch (err) {
            _errorHandle(err);
        }

        console.log(signature)

        let s;
        if(signature){
            s = hexToSignature(signature);
        }

        console.log(s);

        setIsLoading(false)
        if(signature && s){
            setIsSuccess(true)
        }

        return s;

    }

    return {
        write,
        sign,

        error,
        setError,
        isLoading,
        isSuccess,
        isPending,
        isConfirm,
        status

    }

}