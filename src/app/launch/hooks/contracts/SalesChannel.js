
import { useAccount, usePublicClient } from 'wagmi'
import  useWrite  from '../write';

import { SalesChannelContractAddress, getDeadline } from '@/launch/hooks/globalVars'
import SalesChannelABI from '@/abi/SalesChannel.json'

export default function useSalesChannel() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const { write, error, setError, isLoading, isSuccess} = useWrite()

    const getChannelByAddr = async (addr) => {
        let data = await publicClient.readContract({
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'getChannelByAddr',
            args:[addr || accountAddress]
        })
        return data;
    }

    const getChannelById = async (id) => {
        let data = await publicClient.readContract({
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'getChannelById',
            args:[id]
        })
        return data;
    }

    const getChannelCount = async () => {
        let data = await publicClient.readContract({
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
            args: [name, getDeadline()],
        })

        return tx;
    }

    const changeChannelName = async (name) => {
        
        let tx = await write({
            account: accountAddress,
            address: SalesChannelContractAddress,
            abi: SalesChannelABI,
            functionName: 'changeChannelName',
            args: [name, getDeadline()],
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
        setError,
        isLoading,
        isSuccess,

        
    }


}