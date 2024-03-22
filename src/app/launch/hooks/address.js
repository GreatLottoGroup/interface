
import { isAddressEqual } from 'viem'
import { useChainId } from 'wagmi'
import AddressPackages from '@/launch/address.json'
import { CoinList, chains } from '@/launch/hooks/globalVars'

export default function useAddress() {

    const chainId = useChainId()

    const addressPackage = AddressPackages[chainId]

    console.log(addressPackage)

    return {
        chainName: chains[chainId],
        addressPackage,
        payToken: addressPackage.payToken,
        contracts: addressPackage.contracts,
        ...addressPackage.contracts,
        ...addressPackage.payToken,
        getApproveSpender: (name) => {
            return name == 'GLC' ? addressPackage.contracts.PrizePoolContractAddress : addressPackage.contracts.GreatCoinContractAddress;
        },
        getTokenName: (addr) => {
            let tokenName;
            Object.keys(addressPackage.payToken).forEach((name)=>{
                if(isAddressEqual(addressPackage.payToken[name], addr)){
                    tokenName = name;
                }
            })
            return tokenName;
        },
        getTokenDecimals: (addr) => {
            let decimals;
            Object.keys(addressPackage.payToken).forEach((name)=>{
                if(isAddressEqual(addressPackage.payToken[name], addr)){
                    decimals = addressPackage.payToken[name].decimals;
                }
            })
            return decimals;
        },
        CoinList: {
            'GLC': {
                ...CoinList.GLC,
                address: addressPackage.contracts.GreatCoinContractAddress
            },
            'DAI': {
                ...CoinList.DAI,
                address: addressPackage.payToken.DAI
            },
            'USDC': {
                ...CoinList.USDC,
                address: addressPackage.payToken.USDC
            },
            'USDT': {
                ...CoinList.USDT,
                address: addressPackage.payToken.USDT
            }            
        }
    }

}