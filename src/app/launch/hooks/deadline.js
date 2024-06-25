
import { useConfig } from 'wagmi'
import { PerBlockTime } from '@/launch/hooks/globalVars'


export default function useDeadline() {

    const config = useConfig();
    const chainId = config.state.chainId

    const getDeadline = async () => {
        // hardhat
        if(chainId == 31337){
            // 返回超大值
            return BigInt(10**16)
        }
        // 多 10区块 120s 2min
        return BigInt(new Date().getTime())/1000n + PerBlockTime * 10n;
    }

    return {
        getDeadline
    }

}