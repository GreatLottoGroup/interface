'use client';

import { useState, useEffect } from 'react'
import  useCoin  from '@/launch/hooks/coin'
import useAddress from "@/launch/hooks/address"

import Card from '@/launch/components/card'
import WriteBtn from '@/launch/components/writeBtn'
import List from '@/launch/components/list'

import useGreatLotto from '@/launch/hooks/contracts/GreatLotto'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import {useTargetBlock} from '@/launch/hooks/targetBlock'
import { glc, usd, gleth, eth, amount, rate } from "@/launch/components/coinShow"
import useEstimateCost from '@/launch/hooks/estimateCost'

export default function Rollup({setCurrentBlock}) {

    const [rollupReward, setRollupReward] = useState(0)
    const [rollupCost, setRollupCost] = useState(0)
    const [isEthReward, setIsEthReward] = useState(false)

    const [rollupBlocks, setRollupBlocks] = useState([])
    const [isRollupBlockLoading, setIsRollupBlockLoading] = useState(false)

    const { rollupCollection, getRollupReward, getRollupCost, isLoading, isPending } = useGreatLotto()
    const { getBlockBalance } = usePrizePool()

    const {getBlockListWithStatusFromServer} = useTargetBlock()

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
        let [cost, ] = await getRollupCost(blocks, _isEthReward)
        setRollupReward(reward);
        setRollupCost(cost);

        setIsEthReward(_isEthReward);
    }

    const getRollupList = async () => {
        let {result, count} = await getBlockListWithStatusFromServer('waitingRollup');
        console.log(result);

        if(result.length > 0){
            for (let i = 0; i < result.length; i++) {
                let blockBalance = await getBlockBalance(result[i].blockNumber, false);
                let blockBalanceEth = await getBlockBalance(result[i].blockNumber, true);

                result[i] = {
                    ...result[i],
                    blockBalance,
                    blockBalanceEth
                }
            }
            
            // 获取开奖奖励
            let blocks = await getRollupBlockList(result);
            await getRewardInfo(blocks)
            
        }
        
        setRollupBlocks([...result]);
 
    }

    const getRollupBlockList = async (result) => {
        
        if(!result){
            ({result} = await getBlockListWithStatusFromServer('waitingRollup'));
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

        if(blocks.length == 0){
            return false;
        }

        let tx = await rollupCollection(blocks);

        if(tx){
            await initRollupList()
            setCurrentBlock()
        }else{
            console.log('error---');
        }

    }

    const initRollupList = async () => {
        setIsRollupBlockLoading(true)
        await getRollupList()
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
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>Rollup Block</th>
                            <th>Block Prize</th>
                            <th>Block Eth Prize</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rollupBlocks.map((block, index) => (
                            <tr key={index}>
                                <td>{amount(block.blockNumber, true)}</td>
                                <td>{glc(block.blockBalance) || 0}</td>
                                <td>{gleth(block.blockBalanceEth) || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>      
                <p className='card-text mt-2 mb-1 fw-semibold'>Rollup Cost ≈ : {isEthReward ? eth(rollupCost) : usd(rollupCost)}</p>
                <p className='card-text mt-2 mb-1 fw-semibold'>Rollup Reward ≈ : {isEthReward ? gleth(rollupReward) : glc(rollupReward)} {rate('+ ' + getRewardGap(rollupReward, rollupCost))}</p>
                <WriteBtn action={rollupExecute} isLoading={isLoading || isPending} className="btn-lg">Rollup</WriteBtn>
            </List>
        </Card>

    </>

    )
}

