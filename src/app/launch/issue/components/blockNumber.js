'use client';

import { useEffect } from 'react'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import { dateFormatLocal } from '@/launch/hooks/dateFormat'
import { IssueInterval, getBlockTime} from '@/launch/hooks/globalVars'
import { FormControl, Select, MenuItem, Typography } from '@mui/material';

export default function BlockNumberSelect({setLotteryBlockNumber, lotteryBlockNumber, currentBlock}) {

    const config = useConfig();

    const getFirstCycleNumber = (curBlockNumber, offset) => {
        offset = offset || 3n
        return (curBlockNumber/IssueInterval + offset) * IssueInterval
    }

    const intiCycleOptions = (curBlockNumber) => {
        let firstNumber = getFirstCycleNumber(curBlockNumber)
        let options = []

        for(let i=0; i<100; i++){
            let bn = firstNumber + BigInt(i)*IssueInterval
            options.push(
                <MenuItem key={bn} value={bn}>
                    {bn.toString()} &nbsp;&nbsp;&nbsp; {dateFormatLocal(getBlockTime(bn, currentBlock))}
                </MenuItem>
            );
        }
        return options;
    }

    const changeCycle = (val) => {
        setLotteryBlockNumber(BigInt(val))
    }
    
    const initInfo = async () => {
        const curBlockNumber = await getBlockNumber(config);
        // setDefault
        changeCycle(getFirstCycleNumber(curBlockNumber))
    }

    useEffect(() => {

        console.log('useEffect~')
        initInfo();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBlock])


    return (
        <>
            <div className="mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>Lottery block</Typography>
                <FormControl fullWidth size="small">
                    <Select
                        onChange={(e) => changeCycle(e.target.value)}
                        value={lotteryBlockNumber}
                    >
                        {currentBlock?.number && intiCycleOptions(currentBlock.number)}
                    </Select>
                </FormControl>           
            </div>
        </>
    )
}