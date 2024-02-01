
import { isAddressEqual } from 'viem'

import { useAccount, usePublicClient } from 'wagmi'
import useWrite from './write';

import { CoinList } from '@/launch/hooks/globalVars'
import PermitABI from '@/abi/permit_abi.json'

export default function usePermit() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const { sign, error, setError, isLoading, isSuccess} = useWrite()


    const getSignMessage = async (token, spender, amount, deadline) => {

        let chainId = 1; 
        //let chainId = publicClient.chain.id

        let name =  await publicClient.readContract({
            address: token,
            abi: PermitABI,
            functionName: 'name'
        });

        let version = await publicClient.readContract({
            address: token,
            abi: PermitABI,
            functionName: 'version'
        });
        version = version || '1';

        let nonce = await publicClient.readContract({
            address: token,
            abi: PermitABI,
            functionName: 'nonces', 
            args: [accountAddress]
        });

        let config;
        if(isAddressEqual(token, CoinList['DAI'].address)){
            let allowed = amount ? true : false;
            config = {
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
            config = {
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

        console.log(config)

        let signMsg = await sign({
            account: accountAddress,
            domain: {name, version, chainId, verifyingContract: token },
            primaryType: 'Permit',
            ...config
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