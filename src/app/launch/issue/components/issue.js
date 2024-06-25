'use client';
import { useContext } from 'react';

import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import { usePayCoin } from './payCoin'
import { sumCount } from './ball';
import WriteBtn from '@/launch/components/writeBtn'
import { SetGlobalToastContext } from '@/launch/hooks/globalToastContext'

const nearestBlockCount = 400n;

export default function Issue({numberList, setNumberList, multiple, periods, lotteryBlockNumber, payCoin, setPayCoin, setCurrentBlock, channel, isEth}) {

   const config = useConfig();

    const { quoteTicket, issueTicket, issueTicketWithSign, isLoading: issueIsLoading, isPending: issueIsPending} = useGreatLotto()

    const { payExecute, isLoading: coinIsLoading, isPending: coinIsPending } = usePayCoin(payCoin, setPayCoin)

    const setGlobalToast = useContext(SetGlobalToastContext);

    const checkData = (curbn) => {
        let err;
        if(numberList.length < 1) {
            err = 'numberList is error'
        }else if(multiple > 100 || multiple < 1 || periods > 100 || periods < 1){
            err = 'multiple & periods is error'
        }else if(lotteryBlockNumber < curbn + nearestBlockCount){
            err = 'lotteryBlockNumber is error: ' + lotteryBlockNumber.toString()
        }else  if(!payCoin?.name){
            err = 'payCoin is error'
        }
        return err;
    }

    const issueTicketExecute = async () => {

        // console.log(channel)

        const curBlockNumber = await getBlockNumber(config);
        console.log(curBlockNumber);

        // check data
        let checkErr = checkData(curBlockNumber);
        if(checkErr){
            setGlobalToast({
                status: 'error',
                subTitle: 'Issue',
                message: checkErr
            }) 
            return false;
        }
        
        // issue test
        let [totalCount, totalPrize] = await quoteTicket(numberList, multiple, periods, isEth);
        if(sumCount(numberList) != totalCount){
            setGlobalToast({
                status: 'error',
                subTitle: 'Issue',
                message: 'totalCount is error: ' + totalCount
            })
            return false;
        }

        let txIssue = await payExecute(async function(){
            return await issueTicket(numberList, multiple, periods, payCoin.address, lotteryBlockNumber, channel);
        }, async function(){
            return await issueTicketWithSign(numberList, multiple, periods, payCoin.address, lotteryBlockNumber, channel);
        }, totalPrize)

        if(txIssue){
            setNumberList([])
            setCurrentBlock()
        }else{
            console.log('error---');
        }

    }

    return (

    <>
        <WriteBtn action={issueTicketExecute} isLoading={issueIsLoading || coinIsLoading || issueIsPending || coinIsPending} className="btn-success btn-lg">Issue Ticket</WriteBtn>

    </>

    )
}