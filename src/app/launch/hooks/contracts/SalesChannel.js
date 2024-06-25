
import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import  useWrite  from '@/launch/hooks/write';

import useAddress from "@/launch/hooks/address"
import useDeadline from '@/launch/hooks/deadline'

import SalesChannelABI from '@/abi/SalesChannel.json'

export default function useSalesChannel() {

   const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { SalesChannelContractAddress } = useAddress();
    const { getDeadline } = useDeadline();

    const { write, error, isLoading, isSuccess, isPending, isConfirm } = useWrite()

    const getChannelByAddr = async (addr) => {
        let data = await readContract(config, {
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'getChannelByAddr',
            args:[addr || accountAddress]
        })
        return data;
    }

    const getChannelById = async (id) => {
        let data = await readContract(config, {
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'getChannelById',
            args:[id]
        })
        return data;
    }

    const getChannelCount = async () => {
        let data = await readContract(config, {
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'getChannelCount'
        })
        return data;
    }

    const registerChannel = async (name) => {
        
        let tx = await write({
            account: accountAddress,
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'registerChannel',
            args: [name, await getDeadline()],
        })

        return tx;
    }

    const changeChannelName = async (name) => {
        
        let tx = await write({
            account: accountAddress,
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'changeChannelName',
            args: [name, await getDeadline()],
        })

        return tx;
    }   
    const disableChannel = async (id) => {
        
        let tx = await write({
            account: accountAddress,
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'disableChannel',
            args: [id],
        })

        return tx;
    }

    const enableChannel = async (id) => {
        
        let tx = await write({
            account: accountAddress,
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'enableChannel',
            args: [id],
        })

        return tx;
    }

    const statusEl = (status) => {
        if(status){
            return (
                <span className="badge text-bg-success">Working</span>
            )
        }else{
            return (
                <span className="badge text-bg-danger">Disabled</span>
            )
        }
    }

    return {

        getChannelByAddr,
        getChannelById,
        getChannelCount,
        registerChannel,
        changeChannelName,
        disableChannel,
        enableChannel,
        statusEl,

        error,
        isLoading,
        isSuccess,

        isPending,
        isConfirm,
        
    }


}