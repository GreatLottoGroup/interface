'use client';

import { useState, useEffect } from 'react'
import  useCoin  from '@/launch/hooks/coin'
import useAddress from "@/launch/hooks/address"

import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import List from '@/launch/components/list'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from '@mui/material'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import {useTargetBlock} from '@/launch/hooks/targetBlock'
import { glc, usd, gleth, eth, amount, rate } from "@/launch/components/coinShow"
import useEstimateCost from '@/launch/hooks/estimateCost'

export default function Rollup({setCurrentBlock}) {

    const [rollupReward, setRollupReward] = useState(0)
    const [rollupCost, setRollupCost] = useState(0)
    const [gasCost, setGasCost] = useState(0)
    const [isEthReward, setIsEthReward] = useState(false)

    const [rollupBlocks, setRollupBlocks] = useState([])
    const [isRollupBlockLoading, setIsRollupBlockLoading] = useState(false)

    const [executeBlocks, setExecuteBlocks] = useState([])

    const { rollupCollection, getRollupReward, getRollupCost, isLoading, isPending } = useGreatLotto()

    const {getBlockListByStatusFromServer} = useTargetBlock()

    const { getBalance } = useCoin();
    const { PrizePoolContractAddress, GuaranteePoolContractAddress, GreatEthContractAddress } = useAddress()

    const { getRewardGap } = useEstimateCost()

    const getRewardInfo = async(blocks) => {
        let _isEthReward = false;
        let deepBalance = await getBalance(PrizePoolContractAddress, GreatEthContractAddress) + await getBalance(GuaranteePoolContractAddress, GreatEthContractAddress)
        if(deepBalance > 0n){
            _isEthReward = true;
        }

        let [reward, ] = await getRollupReward(blocks, _isEthReward);
        let [cost, , _gasCost] = await getRollupCost(blocks, _isEthReward)
        setRollupReward(reward);
        setRollupCost(cost);
        setGasCost(_gasCost);
        setIsEthReward(_isEthReward);
    }

    const getRollupList = async (_executeBlocks) => {
        let {result, } = await getBlockListByStatusFromServer('waitingRollup', _executeBlocks || executeBlocks);
        console.log(result);

        if(result.length > 0){
            // 获取开奖奖励
            let blocks = await getRollupBlockList(result, _executeBlocks);
            await getRewardInfo(blocks)
        }
        
        setRollupBlocks([...result]);
 
    }

    const getRollupBlockList = async (result, _executeBlocks) => {
        
        if(!result){
            ({result} = await getBlockListByStatusFromServer('waitingRollup', _executeBlocks || executeBlocks));
        }
        let blocks = [];

        if(result.length > 0){
            for (let i = 0; i < result.length; i++) {
                blocks.push(result[i].blockNumber);
            }
            console.log(blocks)
        }

        return blocks
    }

    const rollupExecute = async () =>{

        let blocks = await getRollupBlockList();

        console.log("blocks:", blocks)
        if(blocks.length == 0){
            return false;
        }

        let [tx, status] = await rollupCollection(blocks, gasCost);

        if(tx){
            let _executeBlocks = status == 'success' ? blocks : [];
            setExecuteBlocks(_executeBlocks)
            await initRollupList(_executeBlocks)

            setCurrentBlock()
        }else{
            console.log('error---');
        }

    }

    const initRollupList = async (_executeBlocks) => {
        setIsRollupBlockLoading(true)
        await getRollupList(_executeBlocks)
        setIsRollupBlockLoading(false)
    }

    useEffect(()=>{

        console.log('useEffect~')
        initRollupList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
    <>
        <Card title="Rollup Tickets" reload={getRollupList}>
            <List list={rollupBlocks} isLoading={isRollupBlockLoading}>
                <TableContainer >
                    <Table sx={{ width: '100%' }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Rollup Block</TableCell>
                                <TableCell>Block Prize</TableCell>
                                <TableCell>Block Eth Prize</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rollupBlocks.map((block, index) => (
                                <TableRow key={index} 
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                                >
                                    <TableCell>{amount(block.blockNumber, true)}</TableCell>
                                    <TableCell>{glc(block.blockBalance) || 0}</TableCell>
                                    <TableCell>{gleth(block.blockBalanceEth) || 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>      
                <Stack direction="column" spacing={1} alignItems="flex-start" sx={{mt: 2}}>
                    <Typography variant="subtitle1">Rollup Cost ≈ : {isEthReward ? eth(rollupCost) : usd(rollupCost)}</Typography>
                    <Typography variant="subtitle1">Rollup Reward ≈ : {isEthReward ? gleth(rollupReward) : glc(rollupReward)} {rate('+ ' + getRewardGap(rollupReward, rollupCost))}</Typography>
                    <WriteBtn action={rollupExecute} isLoading={isLoading || isPending}  size="large" variant="outlined">Rollup</WriteBtn>
                </Stack>
            </List>
        </Card>
    </>
    )
}

