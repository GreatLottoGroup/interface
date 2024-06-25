import { useAccount, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'

import  useWrite  from '@/launch/hooks/write';
import  usePermit  from '@/launch/hooks/permit'

import { parseAmount, IssueInterval } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import useDeadline from '@/launch/hooks/deadline'

import GreatLottoABI from '@/abi/GreatLotto.json'
import GreatLottoCoinABI from '@/abi/GreatLottoCoin.json'

import useEstimateCost from '@/launch/hooks/estimateCost'

export default function useGreatLotto() {

    const config = useConfig();
    const { address: accountAddress } = useAccount()
    const { GreatLottoContractAddress, getTokenDecimals, getApproveSpender, getIsEthCoin } = useAddress()
    const { getDeadline } = useDeadline();

    const { write, error, isLoading, isSuccess, isPending, isConfirm} = useWrite()
    const permit = usePermit();

    const { getExecutorReward, getExecutorCost } = useEstimateCost()

    const checkDraw = async (blockNumber) => {
        let data = await readContract(config, {
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'checkDraw',
            args: [blockNumber]
        })
        return data;
    }

    const quoteTicket = async (numbers, multiple, periods, isEth) => {
        let data = await readContract(config, {
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'quoteTicket',
            args: [{numbers, multiple, periods}, isEth]
        })
        return data;
    }

    const issueTicket = async (numbers, multiple, periods, token, targetBlockNumber, channelId) => {
        let issueParam = {
            numbers,
            multiple,
            periods,
            interval: IssueInterval,
            token,
            targetBlockNumber,
            channelId,
            deadline: await getDeadline()
        }
        let tx = await write({
            account: accountAddress,
            address: GreatLottoContractAddress,
            abi: [...GreatLottoABI, ...GreatLottoCoinABI],
            functionName: 'issueTicket',
            args: [issueParam],
        })

        return tx;
    }
    
    const issueTicketWithSign = async (numbers, multiple, periods, token, targetBlockNumber, channelId) => {

        let deadline = await getDeadline();
        let isEth = getIsEthCoin(token);

        let [, amount] = await quoteTicket(numbers, multiple, periods, isEth);

        if(!isEth){
            amount = parseAmount(amount, getTokenDecimals(token));
        }

        let sign = await permit.getSignMessage(token, getApproveSpender(token), amount, deadline)

        if(!sign){
            return false;
        }

        let issueParam = {
            numbers: numbers,
            multiple,
            periods,
            interval: IssueInterval,
            token,
            targetBlockNumber,
            channelId,
            deadline
        };
        let tx = await write({
            account: accountAddress,
            address: GreatLottoContractAddress,
            abi: [...GreatLottoABI, ...GreatLottoCoinABI],
            functionName: 'issueTicketWithSign',
            args: [issueParam, sign.v, sign.r, sign.s],
        })

        return tx;

    }

    const draw = async (blockNumber) => {

        let tx = await write({
            account: accountAddress,
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'draw',
            args: [blockNumber, await getDeadline()],
        })

        return tx;
    }

    const rollupCollection = async (blockNumbers) => {
        
        if(!blockNumbers || blockNumbers.length == 0){
            return false;
        }
        
        let tx = await write({
            account: accountAddress,
            address: GreatLottoContractAddress,
            abi: GreatLottoABI,
            functionName: 'rollupCollection',
            args: [blockNumbers, await getDeadline()],
        })

        return tx;
    }

    const getDrawReward = async (blockNumber, isEth) => {
        return await getExecutorReward(GreatLottoContractAddress, GreatLottoABI, 'draw', [blockNumber, await getDeadline()], isEth);
    }

    const getRollupReward = async (blockNumbers, isEth) => {
        return await getExecutorReward(GreatLottoContractAddress, GreatLottoABI, 'rollupCollection', [blockNumbers, await getDeadline()], isEth);
    }
    const getDrawCost = async (blockNumber, isEth) => {
        return await getExecutorCost(GreatLottoContractAddress, GreatLottoABI, 'draw', [blockNumber, await getDeadline()], isEth);
    }

    const getRollupCost = async (blockNumbers, isEth) => {
        return await getExecutorCost(GreatLottoContractAddress, GreatLottoABI, 'rollupCollection', [blockNumbers, await getDeadline()], isEth);
    }

    return {
        quoteTicket,
        issueTicket,
        issueTicketWithSign,

        draw,
        checkDraw,
        rollupCollection,
        getDrawReward,
        getRollupReward,
        getDrawCost,
        getRollupCost,

        error: error || permit.error,
        isLoading: isLoading || permit.isLoading,
        isSuccess: isSuccess || permit.isSuccess,
        isPending,
        isConfirm
        
    }


}