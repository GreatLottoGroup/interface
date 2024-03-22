'use client';

import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import { usePayCoin } from './payCoin'
import { sumCount } from './ball';
import WriteBtn from '@/launch/components/writeBtn'

const nearestBlockCount = 400n;

export default function Issue({numberList, setNumberList, multiple, periods, lotteryBlockNumber, payCoin, setPayCoin, setCurrentBlock, channel}) {

   const config = useConfig();

    const { issueTicket, quoteTicket, issueTicketWithSign, isLoading: issueIsLoading, isPending: issueIsPending} = useGreatLotto()

    const { payExecute, isLoading: coinIsLoading, isPending: coinIsPending } = usePayCoin(payCoin, setPayCoin)

    const checkData = (curbn) => {
        if(numberList.length < 1) {
            console.log('numberList is error')
            return false;
        }
        if(multiple > 100 || multiple < 1 || periods > 100 || periods < 1){
            console.log('multiple & periods is error')
            return false;
        }
        if(lotteryBlockNumber < curbn + nearestBlockCount){
            console.log('lotteryBlockNumber is error: ' + lotteryBlockNumber.toString())
            return false;
        }
        if(!payCoin?.name){
            console.log('payCoin is error')
            return false;
        }
        return true;
    }

    const issueTicketExecute = async () => {

        // console.log(channel)

        const curBlockNumber = await getBlockNumber(config);
        console.log(curBlockNumber);

        // check data
        if(!checkData(curBlockNumber)){
            console.log('can not issue')
            return false;
        }

        // issue test
        let [totalCount, totalPrize] = await quoteTicket(numberList, multiple, periods);
        if(sumCount(numberList) != totalCount){
            console.log('totalCount is error')
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