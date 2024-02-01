
import { useAccount, usePublicClient } from 'wagmi'
import  useWrite  from '../write';
import  usePermit  from '../permit'

import { GreatLottoContractAddress, GreatCoinContractAddress, getDeadline, getTokendDecimals } from '@/launch/hooks/globalVars'
import GreatLottoABI from '@/abi/GreatLotto.json'

export default function useGreatLotto() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const { write, error, setError, isLoading, isSuccess} = useWrite()
    const permit = usePermit();


    const findFirstDrawBlock = async () => {
        let data = await publicClient.readContract({
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'findFirstDrawBlock'
        })
        return data;
    }

    const checkBlockBonus = async (blockNumber) => {
        let data = await publicClient.readContract({
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'checkBlockBonus',
            args: [blockNumber]
        })
        return data;
    }


    const quoteTicket = async (numberList, multiple, periods) => {
        const [totalCount, totalPrize] = await publicClient.readContract({
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'quoteTicket',
            args: [numberList, multiple, periods]
        })
        //console.log('totalCount: ' + totalCount);
        //console.log('totalPrize: ' + totalPrize);
        return [totalCount, totalPrize]
    }

    const issueTicket = async (numberList, multiple, periods, token, blockNumber, channel) => {
        
        let tx = await write({
            account: accountAddress,
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'issueTicket',
            args: [numberList, multiple, periods, token, blockNumber, channel, getDeadline()],
        })

        return tx;
    }
    
    const issueTicketWithSign = async (numberList, multiple, periods, token, blockNumber, channel) => {

        let deadline = getDeadline();

        let [, amount] = await quoteTicket(numberList, multiple, periods);

        let sign = permit.getSignMessage(token, GreatCoinContractAddress, parseUnits(amount, getTokendDecimals(token)), deadline)

        if(!sign){
            return false;
        }

        let tx = await write({
            account: accountAddress,
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'issueTicketWithSign',
            args: [numberList, multiple, periods, token, blockNumber, channel, deadline, sign.v, sign.r, sign.s],
        })

        return tx;

    }

    const draw = async () => {

        let tx = await write({
            account: accountAddress,
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'draw',
            args: [getDeadline()],
        })

        return tx;
    }

    return {

        findFirstDrawBlock,
        checkBlockBonus,
        quoteTicket,
        issueTicket,
        issueTicketWithSign,
        draw,

        error: error || permit.error,
        setError: function(){
            setError();
            permit.setError();
        },
        isLoading: isLoading || permit.isLoading,
        isSuccess: isSuccess || permit.isSuccess,

        
    }


}