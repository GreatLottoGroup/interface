'use client';

import { useState } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { hexToSignature, BaseError, ContractFunctionRevertedError } from 'viem'

export default function useWrite() {

    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const errorHandle = (error) => {
        setError(error);

        if (error instanceof BaseError) {
            const revertError = error.walk(err => err instanceof ContractFunctionRevertedError)
            console.log('revertError');
            console.log(revertError);
            if (revertError instanceof ContractFunctionRevertedError) {
                const errorName = revertError.data?.errorName ?? ''
                console.log(errorName);
            }
        }

    }

    const write = async (config) => {
        setIsLoading(true)
        setIsSuccess(false)
        setError()

        console.log(config)

        let request
        try {
            ({ request } = await publicClient.simulateContract(config))
        } catch (error) {
            errorHandle(error);
        }

        console.log(request)

        let tx;
        if(request){
            try {
                tx = await walletClient.writeContract(request)
            } catch (error) {
                errorHandle(error);
            }
        }

        console.log(tx);

        setIsLoading(false)
        if(tx){
            setIsSuccess(true)
        }

        return tx;

    }

    const sign = async (config) => {
        setIsLoading(true)
        setIsSuccess(false)
        setError()

        console.log(config)

        let signature
        try {
            signature = await walletClient.signTypedData(config);
        } catch (error) {
            errorHandle(error);
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
    }

}