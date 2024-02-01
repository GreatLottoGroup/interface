

import { useAccount, usePublicClient } from 'wagmi'

import { GreatNftContractAddress } from '@/launch/hooks/globalVars'
import GreatNftABI from '@/abi/GreatLottoNFT.json'
import  useWrite  from '../write';

export default function useGreatLottoNft() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()
    const { write, error, setError, isLoading, isSuccess} = useWrite()

    const getNftBalance = async (address) => {
        let data = await publicClient.readContract({
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'balanceOf',
            args: [address || accountAddress]
        })
        return data;
    }

    const getNftToken = async (index, address) => {
        let data = await publicClient.readContract({
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'tokenOfOwnerByIndex',
            args: [address || accountAddress, index]
        })
        return data;
    }

    const getNftTicket = async (token) => {
        let data = await publicClient.readContract({
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'getTicket',
            args: [token]
        })
        return data;
    } 

    const getNftSVG = async (token) => {
        let uri = await publicClient.readContract({
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
        let data = await publicClient.readContract({
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'NFTSVGAddress'
        })
        return data;        
    }

    const changeNFTSVGAddress = async (addr) => {
        let tx = await write({
            account: accountAddress,
            address: GreatNftContractAddress,
            abi: GreatNftABI,
            functionName: 'changeNFTSVGAddress',
            args: [addr],
        })
        return tx;
    }

    const getTicketsByTargetNumber = async (blockNumber) => {
        let data = await publicClient.readContract({
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
        setError,
        isLoading,
        isSuccess,
    }


}