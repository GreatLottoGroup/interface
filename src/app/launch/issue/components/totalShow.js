'use client';

import { useState, useEffect } from 'react'
import { dateFormatLocal, dateFormatUTC } from '@/launch/hooks/dateFormat'
import { PerBlockTime, IssueInterval} from '@/launch/hooks/globalVars'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import { glc, amount, gleth } from "@/launch/components/coinShow"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

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
        <TableContainer>
            <Table sx={{ width: '100%' }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Lottery Block Number</TableCell>
                        <TableCell>Block Balance</TableCell>
                        <TableCell>Draw Time (Local)</TableCell>
                        <TableCell>Draw Time (GMT)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {blockNumbers.map((item, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                        >
                            <TableCell>{amount(item, true)}</TableCell>
                            <TableCell>{isEth ? gleth(blockBalance[index]) : glc(blockBalance[index])}</TableCell>
                            <TableCell>{currentBlock?.number && dateFormatLocal(getLotteryBlockTime(item))}</TableCell>
                            <TableCell>{currentBlock?.number && dateFormatUTC(getLotteryBlockTime(item))}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}