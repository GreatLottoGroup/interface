
import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import  useWrite  from '../write';
import  usePermit  from '../permit'

import { getDeadline, parseAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import GreatLottoABI from '@/abi/GreatLotto.json'

export default function useGreatLotto() {

    const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { GreatLottoContractAddress, GreatCoinContractAddress, getTokenDecimals } = useAddress()

    const { write, error, setError, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const permit = usePermit();


    const findFirstDrawBlock = async () => {
        let data = await readContract(config, {
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'findFirstDrawBlock'
        })
        return data;
    }

    const checkBlockBonus = async (blockNumber) => {
        let data = await readContract(config, {
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'checkBlockBonus',
            args: [blockNumber]
        })
        return data;
    }


    const quoteTicket = async (numberList, multiple, periods) => {
        const [totalCount, totalPrize] = await readContract(config, {
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

        let sign = await permit.getSignMessage(token, GreatCoinContractAddress, parseAmount(amount, getTokenDecimals(token)), deadline)

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
        isPending,
        isConfirm
        
    }


}