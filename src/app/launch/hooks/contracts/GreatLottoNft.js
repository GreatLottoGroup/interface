

import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import useAddress from "@/launch/hooks/address"

import GreatNftABI from '@/abi/GreatLottoNFT.json'
import  useWrite  from '@/launch/hooks/write';

export default function useGreatLottoNft() {

    const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const { GreatNftContractAddress } = useAddress();

    const getNftBalance = async (address) => {
        let data = await readContract(config, {
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'balanceOf',
            args: [address || accountAddress]
        })
        return data;
    }

    const getNftToken = async (index, address) => {
        let data = await readContract(config, {
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'tokenOfOwnerByIndex',
            args: [address || accountAddress, index]
        })
        return data;
    }

    const getNftTicket = async (token) => {
        let data = await readContract(config, {
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'getTicket',
            args: [token]
        })
        return data;
    } 

    const getNftSVG = async (token) => {
        let uri = await readContract(config, {
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'tokenURI',
            args: [token]
        })

        uri = uri.slice('data:application/json;base64,'.length);
        uri = Buffer.from(uri, 'base64');
        uri = JSON.parse(uri);
        let img = uri.image;
        img = img.slice('data:image/svg+xml;base64,'.length);
        img = Buffer.from(img, 'base64');
        return img;
    } 

    const getNFTSVGAddress = async () => {
        let data = await readContract(config, {
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'NFTSVGAddress'
        })
        return data;        
    }

    const changeNFTSVGAddress = async (addr) => {
        let [tx, ] = await write({
            account: accountAddress,
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'changeNFTSVGAddress',
            args: [addr],
        })
        return tx;
    }

    const getTicketsByTargetNumber = async (blockNumber) => {
        let data = await readContract(config, {
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'getTicketsByTargetNumber',
            args: [blockNumber]
        })
        return data;
    } 

    return {
        getNftBalance, 
        getNftToken,
        getNftTicket, 
        getNftSVG,
        getNFTSVGAddress,
        changeNFTSVGAddress,
        getTicketsByTargetNumber,

        error,
        isLoading,
        isSuccess,
        isPending,
        isConfirm,
    }


}