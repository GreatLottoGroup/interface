'use client';

import { useState, useEffect } from 'react'
import  useCoin  from '@/launch/hooks/coin'
import useAddress from "@/launch/hooks/address"

import { DrawGroupBalls } from '@/launch/hooks/balls'
import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import List from '@/launch/components/list'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'

import { glc, usd, gleth, eth, amount, rate } from "@/launch/components/coinShow"
import useEstimateCost from '@/launch/hooks/estimateCost'

import {useTargetBlock} from '@/launch/hooks/targetBlock'


export default function DrawTicket({setCurrentBlock}) {

    const [drawReward, setDrawReward] = useState(0)
    const [drawCost, setDrawCost] = useState(0)
    const [isEthReward, setIsEthReward] = useState(false)

    const [drawList, setDrawList] = useState([])
    const [isDrawListLoading, setIsDrawListLoading] = useState(false)

    const { checkDraw, draw, getDrawReward, getDrawCost, isLoading, isPending } = useGreatLotto()
    const { getBlockBalance, getRollupBalance } = usePrizePool()

    const {getBlockListWithStatus, drawSoonList} = useTargetBlock()
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
        let [cost, ] = await getDrawCost(drawBlock.blockNumber, _isEthReward)
        console.log('reward:', reward);
        setDrawReward(reward);
        setDrawCost(cost);

        setIsEthReward(_isEthReward);
    }

    const getDrawList = async () => {

        let drawList = [];
        let {_drawSoonList} = await getBlockListWithStatus();
        
        console.log(_drawSoonList);

        if(_drawSoonList.length > 0){
            let rollupBalance = await getRollupBalance(false);
            let rollupBalanceEth = await getRollupBalance(true);
            
            for (let i = 0; i < _drawSoonList.length; i++) {
                let block = _drawSoonList[i].blockNumber;
                let info = await checkDraw(block);
                console.log(info);

                let blockBalance = await getBlockBalance(block, false);
                let blockBalanceEth = await getBlockBalance(block, true);

                rollupBalance += blockBalance - info.award.normalAwardSumAmount;
                rollupBalanceEth += blockBalanceEth - info.awardByEth.normalAwardSumAmount;
                
                let drawBlock = {
                    blockNumber: block,
                    drawNumber: info.drawNumber,
                    award: {
                        blockBalance: blockBalance,
                        rollupBalance: rollupBalance,
                        normalAwardSumAmount: info.award.normalAwardSumAmount,
                        topBonusMultiples: info.award.topBonusMultiples
                    },
                    awardByEth: {
                        blockBalance: blockBalanceEth,
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

        let drawNumber = drawSoonList[0]?.blockNumber;
        let tx;

        if(drawNumber){
            tx = await draw(drawNumber);
        }

        if(tx){
            await initDrawList()
            setCurrentBlock()
        }else{
            console.log('error---');
        }

    }

    const initDrawList = async () => {
        setIsDrawListLoading(true)
        await getDrawList()
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
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>Draw Block</th>
                            <th>Draw Number</th>
                            <th>Standard Coin Award</th>
                            <th>Eth Coin Award</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drawList.map((drawBlock, index) => (
                            <tr key={index}>
                                <td>{amount(drawBlock.blockNumber, true)}</td>
                                <td><DrawGroupBalls drawNumbers={drawBlock.drawNumber} /></td>
                                <td>
                                    <div className='mb-1'>Sum Amount: {glc(drawBlock.award.normalAwardSumAmount)}</div>
                                    <div className='mb-1'>Block Prize Pool: {glc(drawBlock.award.blockBalance || 0)}</div>
                                    <div className='mb-1'>Top Bonus Count: {amount(drawBlock.award.topBonusMultiples || 0, true)}</div>
                                    <div>Top Prize Pool: {glc(drawBlock.award.rollupBalance)}</div>
                                </td>
                                <td>
                                    <div className='mb-1'>Sum Amount: {gleth(drawBlock.awardByEth.normalAwardSumAmount)}</div>
                                    <div className='mb-1'>Block Prize Pool: {gleth(drawBlock.awardByEth.blockBalance || 0)}</div>
                                    <div className='mb-1'>Top Bonus Count: {amount(drawBlock.awardByEth.topBonusMultiples || 0, true)}</div>
                                    <div>Top Prize Pool: {gleth(drawBlock.awardByEth.rollupBalance)}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className='card-text mt-2 mb-1 fw-semibold'>Draw Cost ≈ : {isEthReward ? eth(drawCost) : usd(drawCost)}</p>
                <p className='card-text mt-2 mb-1 fw-semibold'>Draw Reward ≈ : {isEthReward ? gleth(drawReward) : glc(drawReward)} {rate('+ ' + getRewardGap(drawReward, drawCost))}</p>
                <WriteBtn action={drawExecute} isLoading={isLoading || isPending}  className="btn-lg">Draw</WriteBtn>
            </List>
        </Card>

    </>

    )
}

