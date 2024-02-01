'use client';

import { usePublicClient } from 'wagmi'
import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import { usePayCoin } from './payCoin'
import { sumCount } from './ball';

const nearestBlockCount = 400n;

export default function Issue({numberList, setNumberList, multiple, periods, lotteryBlockNumber, payCoin, setPayCoin, setCurrentBlock, channel}) {

    const publicClient = usePublicClient()

    const { issueTicket, quoteTicket, issueTicketWithSign,  error: issueError, setError: setIssueError, isLoading: issueIsLoading, isSuccess: issueIsSuccess} = useGreatLotto()

    const { payExecute, error: coinError, setError: setCoinError, isLoading: coinIsLoading } = usePayCoin(payCoin, setPayCoin)

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

        const curBlockNumber = await publicClient.getBlockNumber();
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

        <button type="button" disabled={issueIsLoading || coinIsLoading} className='btn btn-success btn-lg'  onClick={()=>{issueTicketExecute()}}> Issue {(issueIsLoading || coinIsLoading) ? '...' : ''}</button>

        <div>{issueIsLoading && 'Loading'} {issueIsSuccess && 'Success'}</div>

        <div>{ (coinError || issueError)  && (
            <>
            <code>Error: {(coinError || issueError)?.message} </code>
            <button type="button" className="btn-close" onClick={()=>{setCoinError();setIssueError()}}></button>
            </>
            )}
        </div>

    </>

    )
}