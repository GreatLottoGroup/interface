
import { isAddressEqual, isAddress } from 'viem'
import { useChainId } from 'wagmi'
import AddressPackages from '@/launch/address.json'
import { CoinList, chains } from '@/launch/hooks/globalVars'

export default function useAddress() {

    const chainId = useChainId()

    const addressPackage = AddressPackages[chainId]

    //console.log(addressPackage)

    const _coinList = {
        'GLC': {
            ...CoinList.GLC,
            address: addressPackage.contracts.GreatCoinContractAddress
        },
        'GLETH': {
        ...CoinList.GLETH,
        address: addressPackage.contracts.GreatEthContractAddress
        },
    }

    Object.keys(CoinList).map((name)=>{
        if(addressPackage.payToken[name]){
            _coinList[name] = {
                ...CoinList[name],
                address: addressPackage.payToken[name]
            }
        }
    })

    const isGreatCoin = (addr) => {
        return isAddressEqual(addr, addressPackage.contracts.GreatCoinContractAddress);
    }

    const isGreatEth = (addr) => {
        return isAddressEqual(addr, addressPackage.contracts.GreatEthContractAddress);
    }

    return {
        chainName: chains[chainId],
        addressPackage,
        payToken: addressPackage.payToken,
        contracts: addressPackage.contracts,
        ...addressPackage.contracts,
        ...addressPackage.payToken,
        getApproveSpender: (name) => {
            if(isAddress(name)){
                if(isGreatCoin(name) || isGreatEth(name)){
                    return addressPackage.contracts.PrizePoolContractAddress;
                }else if(isAddressEqual(name, _coinList['WETH']?.address)){
                    return addressPackage.contracts.GreatEthContractAddress;
                }else{
                    return addressPackage.contracts.GreatCoinContractAddress;
                }
            }else{
                if(name == 'GLC' || name == 'GLETH'){
                    return addressPackage.contracts.PrizePoolContractAddress;
                }else if(name == 'WETH'){
                    return addressPackage.contracts.GreatEthContractAddress;
                }else{
                    return addressPackage.contracts.GreatCoinContractAddress;
                }
            }
        },
        getTokenName: (addr) => {
            let tokenName;
            if(isGreatCoin(addr)){
                tokenName = 'GLC';
            }else if(isGreatEth(addr)){
                tokenName = 'GLETH';
            }else{
                Object.keys(addressPackage.payToken).forEach((name)=>{
                    if(isAddressEqual(addressPackage.payToken[name], addr)){
                        tokenName = name;
                    }
                })
            }
            return tokenName;
        },
        getTokenDecimals: (addr) => {
            let decimals;
            if(isGreatCoin(addr)){
                decimals = CoinList['GLC'].decimals;
            }else if(isGreatEth(addr)){
                decimals = CoinList['GLETH'].decimals;
            }else{
                Object.keys(addressPackage.payToken).forEach((name)=>{
                    if(isAddressEqual(addressPackage.payToken[name], addr)){
                        decimals = CoinList[name].decimals;
                    }
                })
            }
            return decimals;
        },
        getIsEthCoin: (name) => {
            if(isAddress(name)){
                if(isGreatEth(name) || (_coinList['WETH']?.address && isAddressEqual(name, _coinList['WETH']?.address))){
                    return true;
                }else{
                    return false;
                }
            }else{
                if(name == 'GLETH' || name == 'WETH'){
                    return true;
                }else{
                    return false;
                }
            }
        },
        CoinList: _coinList
    }

}