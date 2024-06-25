'use client';

import { useState, useEffect } from 'react'
import { dateFormatLocal, dateFormatUTC } from '@/launch/hooks/dateFormat'
import { PerBlockTime, IssueInterval} from '@/launch/hooks/globalVars'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import { glc, amount, gleth } from "@/launch/components/coinShow"

export default function TotalShow({lotteryBlockNumber, periods, currentBlock, isEth}) {


    const { getBlockBalance} = usePrizePool();

    const [blockNumbers, setBlockNumbers] = useState([])
    const [blockBalance, setBlockBalance] = useState([])

    const getLotteryBlockTime = (n) => {
        if(n && currentBlock?.number){
            return Number((n - currentBlock.number) * PerBlockTime + currentBlock.timestamp) * 1000
        }else{
            return 0
        }
    }
    
    const initInfo = async () => {
        let numberList = [];
        let balanceList = []
        if(!lotteryBlockNumber){
            return;
        }
        for (let i = 0; i < periods; i++) {
            let num = lotteryBlockNumber + BigInt(i) * IssueInterval;
            let balance = await getBlockBalance(num, isEth);
            numberList.push(num); 
            balanceList.push(balance);
        }
        setBlockNumbers(numberList);
        setBlockBalance(balanceList);
    }

    useEffect(() => {

        console.log('useEffect~')
        initInfo();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lotteryBlockNumber, periods])


    return (
        <table className='table table-hover'>
            <thead>
                <tr>
                    <th>Lottery Block Number</th>
                    <th>Block Balance</th>
                    <th>Draw Time (Local)</th>
                    <th>Draw Time (GMT)</th>
                </tr>
            </thead>
            <tbody>
                {blockNumbers.map((item, index) => (
                    <tr key={index}>
                        <td>{amount(item, true)}</td>
                        <td>{isEth ? gleth(blockBalance[index]) : glc(blockBalance[index])}</td>
                        <td>{currentBlock?.number && dateFormatLocal(getLotteryBlockTime(item))}</td>
                        <td>{currentBlock?.number && dateFormatUTC(getLotteryBlockTime(item))}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        
    )
}