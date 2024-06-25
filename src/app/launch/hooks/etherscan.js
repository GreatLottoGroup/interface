
import { useContext } from 'react'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'


const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const API_HOST = 'https://api.etherscan.io/api?'

export default function useEtherscan() {

    const setGlobalToast = useContext(SetGlobalToastContext)

    const getData = async (module, action) => {

        let params = new URLSearchParams({
            module: module,
            action: action,
            apikey: API_KEY
        });

        let url = API_HOST + params.toString()

        let res = await fetch(url);

        if (!res.ok) {
            setGlobalToast({
                status: 'error',
                subTitle: 'etherscan',
                message: 'Request failed: ' + url
            });
            return false;
        }

        let {status, result} = await res.json();

        if(status != '1'){
            setGlobalToast({
                status: 'error',
                subTitle: 'etherscan',
                message: 'Request failed: ' + result
            });
            return false;
        }
        console.log(result)
        return result;
    }


    const getEthPrice = async () => {
        return await getData('stats', 'ethprice');
    }

    return {
        getData,
        getEthPrice,
    }

}