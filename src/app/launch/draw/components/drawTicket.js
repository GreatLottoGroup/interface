'use client';

import { useState, useEffect } from 'react'
import  useCoin  from '@/launch/hooks/coin'
import useAddress from "@/launch/hooks/address"

import { DrawGroupBalls } from '@/launch/components/balls'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import List from '@/launch/components/list'
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack, Typography
} from '@mui/material'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'

import { glc, usd, gleth, eth, amount, rate } from "@/launch/components/coinShow"
import useEstimateCost from '@/launch/hooks/estimateCost'

import {useTargetBlock} from '@/launch/hooks/targetBlock'

export default function DrawTicket({setCurrentBlock}) {

    const [drawReward, setDrawReward] = useState(0)
    const [drawCost, setDrawCost] = useState(0)
    const [gasCost, setGasCost] = useState(0)

    const [isEthReward, setIsEthReward] = useState(false)

    const [drawList, setDrawList] = useState([])
    const [isDrawListLoading, setIsDrawListLoading] = useState(false)

    const [executeBlocks, setExecuteBlocks] = useState([])

    const { checkDraw, draw, getDrawReward, getDrawCost, isLoading, isPending } = useGreatLotto()
    const { getRollupBalance } = usePrizePool()

    const { getBlockListByStatusFromServer} = useTargetBlock()
    const { getBalance } = useCoin();
    const { PrizePoolContractAddress, GuaranteePoolContractAddress, GreatEthContractAddress } = useAddress()

    const { getRewardGap } = useEstimateCost()

    //  coin  eth
    //   Y     Y   eth
    //   Y     N   coin
    //   N     Y   eth
    //   N     N   eth
    const getRewardInfo = async(drawBlock) => {
        let _isEthReward = false;
        let deepBalance = await getBalance(PrizePoolContractAddress, GreatEthContractAddress) + await getBalance(GuaranteePoolContractAddress, GreatEthContractAddress);

        let isNoDraw = false;
        let isEthDraw = false;
        if(drawBlock.awardByEth.normalAwardSumAmount > 0n || drawBlock.awardByEth.topBonusMultiples > 0n){
            isEthDraw = true;
        }
        if(drawBlock.award.normalAwardSumAmount == 0n && drawBlock.award.topBonusMultiples == 0n && !isEthDraw){
            isNoDraw = true;
        }

        if((isEthDraw || isNoDraw) && deepBalance > 0n){
            _isEthReward = true;
        }

        let [reward, ] = await getDrawReward(drawBlock.blockNumber, _isEthReward)
        let [cost, , _gasCost] = await getDrawCost(drawBlock.blockNumber, _isEthReward)
        console.log('reward:', reward);
        setDrawReward(reward);
        setDrawCost(cost);
        setGasCost(_gasCost);

        setIsEthReward(_isEthReward);
    }

    const getDrawList = async (_executeBlocks) => {

        let drawList = [];
        let {result} = await getBlockListByStatusFromServer('drawSoon', _executeBlocks || executeBlocks);
        
        console.log(result);

        if(result.length > 0){
            let rollupBalance = await getRollupBalance(false);
            let rollupBalanceEth = await getRollupBalance(true);
            
            for (let i = 0; i < result.length; i++) {
                let block = result[i].blockNumber;
                let info = await checkDraw(block);
                console.log(info);

                rollupBalance += BigInt(result[i].blockBalance) - info.award.normalAwardSumAmount;
                rollupBalanceEth += BigInt(result[i].blockBalanceEth) - info.awardByEth.normalAwardSumAmount;
                
                let drawBlock = {
                    blockNumber: block,
                    drawNumber: info.drawNumber,
                    award: {
                        blockBalance: BigInt(result[i].blockBalance),
                        rollupBalance: rollupBalance,
                        normalAwardSumAmount: info.award.normalAwardSumAmount,
                        topBonusMultiples: info.award.topBonusMultiples
                    },
                    awardByEth: {
                        blockBalance: BigInt(result[i].blockBalanceEth),
                        rollupBalance: rollupBalanceEth,
                        normalAwardSumAmount: info.awardByEth.normalAwardSumAmount,
                        topBonusMultiples: info.awardByEth.topBonusMultiples
                    }
                }

                drawList.push(drawBlock);

                if(info.award.topBonusMultiples > 0){
                    rollupBalance = 0n;
                }
                if(info.awardByEth.topBonusMultiples > 0){
                    rollupBalanceEth = 0n;
                }

            }

            // 获取开奖奖励
            await getRewardInfo(drawList[0]);
        }
        
        setDrawList(drawList);
       
    }

    const drawExecute = async () =>{

        let {result} = await getBlockListByStatusFromServer('drawSoon', executeBlocks);

        let drawNumber = result[0]?.blockNumber;
        let tx, status;

        if(drawNumber){
            [tx, status] = await draw(drawNumber, gasCost);
        }

        if(tx){
            let _executeBlocks = status == 'success' ? [drawNumber] : [];
            setExecuteBlocks(_executeBlocks)
            await initDrawList(_executeBlocks)

            setCurrentBlock()
        }else{
            console.log('error---');
        }

    }

    const initDrawList = async (_executeBlocks) => {
        setIsDrawListLoading(true)
        await getDrawList(_executeBlocks)
        setIsDrawListLoading(false)
    }

    useEffect(()=>{

        console.log('useEffect~')
        initDrawList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
    <>

        <Card title="Draw Tickets" reload={initDrawList}>
            <List list={drawList} isLoading={isDrawListLoading}>
                <TableContainer >
                    <Table sx={{ width: '100%' }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Draw Block</TableCell>
                                <TableCell>Draw Number</TableCell>
                                <TableCell>Standard Coin Award</TableCell>
                                <TableCell>Eth Coin Award</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {drawList.map((drawBlock, index) => (
                                <TableRow key={index} 
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                                >
                                    <TableCell>{amount(drawBlock.blockNumber, true)}</TableCell>
                                    <TableCell><DrawGroupBalls drawNumbers={drawBlock.drawNumber} /></TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Sum Amount: {glc(drawBlock.award.normalAwardSumAmount)}
                                        </Typography>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Block Prize Pool: {glc(drawBlock.award.blockBalance || 0)}
                                        </Typography>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Top Bonus Count: {amount(drawBlock.award.topBonusMultiples || 0, true)}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Top Prize Pool: {glc(drawBlock.award.rollupBalance)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Sum Amount: {gleth(drawBlock.awardByEth.normalAwardSumAmount)}
                                        </Typography>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Block Prize Pool: {gleth(drawBlock.awardByEth.blockBalance || 0)}
                                        </Typography>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Top Bonus Count: {amount(drawBlock.awardByEth.topBonusMultiples || 0, true)}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Top Prize Pool: {gleth(drawBlock.awardByEth.rollupBalance)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack direction="column" spacing={1} alignItems="flex-start" sx={{mt: 2}}>
                    <Typography variant="subtitle1">
                        Draw Cost ≈ : {isEthReward ? eth(drawCost) : usd(drawCost)}
                    </Typography>
                    <Typography variant="subtitle1">
                        Draw Reward ≈ : {isEthReward ? gleth(drawReward) : glc(drawReward)} {rate('+ ' + getRewardGap(drawReward, drawCost))}
                    </Typography>
                    <WriteBtn action={drawExecute} isLoading={isLoading || isPending} size="large" variant="outlined">Draw</WriteBtn>
                </Stack>
            </List>
        </Card>
    </>
    )
}

