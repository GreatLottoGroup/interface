
import { isAddressEqual } from 'viem'
import { useAccount, useConfig } from 'wagmi'
import { readContract, getChainId } from '@wagmi/core'

import useWrite from './write';

import useAddress from "@/launch/hooks/address"

import PermitABI from '@/abi/permit_abi.json'

export default function usePermit() {

    const config = useConfig();
    const { address: accountAddress } = useAccount()    
    const { CoinList } = useAddress();

    const { sign, error, setError, isLoading, isSuccess} = useWrite()


    const getSignMessage = async (token, spender, amount, deadline) => {

        let chainId = getChainId(config);
        
        // hardhat
        if(chainId == 31337){
            chainId = 1;
        }

        let name =  await readContract(config, {
            address: token,
            abi: PermitABI,
            functionName: 'name'
        });

        let version = await readContract(config, {
            address: token,
            abi: PermitABI,
            functionName: 'version'
        });
        version = version || '1';

        let nonce = await readContract(config, {
            address: token,
            abi: PermitABI,
            functionName: 'nonces', 
            args: [accountAddress]
        });

        let signReq;
        if(isAddressEqual(token, CoinList['DAI'].address)){
            let allowed = amount ? true : false;
            signReq = {
                types: {Permit: [
                    {name: "holder", type: "address"},
                    {name: "spender", type: "address"},
                    {name: "nonce", type: "uint256"},
                    {name: "expiry", type: "uint256"},
                    {name: "allowed", type: "bool"}
                ]},
                message: {holder: accountAddress, spender, nonce, expiry: deadline, allowed}
            }
        }else{
            signReq = {
                types: {Permit: [
                    {name: "owner", type: "address"},
                    {name: "spender", type: "address"},
                    {name: "value", type: "uint256"},
                    {name: "nonce", type: "uint256"},
                    {name: "deadline", type: "uint256"}
                ]},
                message: {owner: accountAddress, spender, value: amount, nonce, deadline}
            }
        }

        console.log(signReq)

        let signMsg = await sign({
            account: accountAddress,
            domain: {name, version, chainId, verifyingContract: token },
            primaryType: 'Permit',
            ...signReq
        });

        return signMsg;

    }


    return {

        getSignMessage,

        error,
        setError,
        isLoading,
        isSuccess,
        
    }


}