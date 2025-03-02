'use client';

import { useState, useEffect, useContext } from 'react'
import { Stack, Box, Button, Typography } from '@mui/material';
import { IsMobileContext } from '@/hooks/mediaQueryContext';

import { Multiple, Periods} from './components/multiple'
import { BallSelect, BallGroup, sumCount} from './components/ball'
import BlockNumberSelect from './components/blockNumber'
import { PayCoin } from './components/payCoin'
import Issue from './components/issue'
import Channel from './components/channel'
import  useCurrentBlock  from '@/launch/hooks/currentBlock'
import './page.css'
import TotalShow from './components/totalShow';
import { PricePerCount, PricePerCountEth, formatAmount, parseAmount } from '@/launch/hooks/globalVars'
import { amount, usd, eth, gldc } from "@/launch/components/coinShow"
import useDaoCoin from '@/launch/hooks/contracts/DaoCoin'

export default function IssueTicket() {

    const [numberList, setNumberList] = useState([])
    const [multiple, setMultiple] = useState(1)
    const [periods, setPeriods] = useState(1)
    const [lotteryBlockNumber, setLotteryBlockNumber] = useState(0)
    const [payCoin, setPayCoin] = useState({})
    const [channel, setChannel] = useState(0)
    const [isEth, setIsEth] = useState(false)

    const [daoReward, setDaoReward] = useState(0)

    const {currentBlock, setCurrentBlock} = useCurrentBlock()
    const { getMintShares } = useDaoCoin()

    const isMobile = useContext(IsMobileContext);

    const sumTotalCount = () => {
        return sumCount(numberList) * BigInt(multiple * periods);
    }
    const getPricePerCount = () => {
        return isEth ? formatAmount(PricePerCountEth) * 1 : Number(PricePerCount);
    }
    const sumTotalPrice = () => {
        let price = isEth ? PricePerCountEth : PricePerCount;
        let totalPrice = sumTotalCount() * price;
        return totalPrice;
    }

    const getDaoReward = async () => {
        let price = sumTotalPrice();
        if(!isEth){
            price = parseAmount(sumTotalPrice());
        }
        if(price > 0){
            let reward = await getMintShares(price, isEth);
            setDaoReward(reward);
        }else{
            setDaoReward(0);
        }
    }

    useEffect(() => {

        console.log('useEffect~')
        getDaoReward();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberList, multiple, periods, isEth])


  return (
    <>
    
        <BallSelect numberList={numberList} setNumberList={setNumberList}/>

        <BallGroup numberList={numberList} setNumberList={setNumberList}/>

        <div className='border px-3 py-3 mb-3'>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 3}>
                <Stack direction='row' spacing={3} sx={{ width: isMobile ? '100%' : '60%' }}>
                    <Box sx={{ width: '50%' }}>                        
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>Current Block Number</Typography>
                        <div className='mt-2 mb-2'>
                            {currentBlock?.number?.toString()}
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                sx={{ ml: 2 }}
                                onClick={()=>{setCurrentBlock()}}
                            >
                                ReLoad
                            </Button>
                        </div>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <BlockNumberSelect setLotteryBlockNumber={setLotteryBlockNumber} lotteryBlockNumber={lotteryBlockNumber} currentBlock={currentBlock}/>
                    </Box>
                </Stack>
                <Stack direction='row' spacing={3} sx={{ width: isMobile ? '100%' : '40%' }}>
                    <Box sx={{ width: '50%'}}>
                        <Periods periods={periods} setPeriods={setPeriods} />
                    </Box>

                    <Box sx={{ width: '50%'}}>
                        <Multiple multiple={multiple} setMultiple={setMultiple} />
                    </Box>
                </Stack>
            </Stack>
        </div>
        
        <div className='border px-3 py-3 mb-3'>
            <Stack spacing={1}>
                <Box>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>Sum Count:</Typography>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>{amount(sumTotalCount(), true)}</Typography>
                    <Typography component="span" color="text.secondary"> = {sumCount(numberList).toString()} (Balls) * {periods} (Periods) * {multiple} (Multiple)</Typography>
                </Box>
                <Box>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>Sum Price:</Typography>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>{isEth ? eth(sumTotalPrice()) : usd(sumTotalPrice(), true)}</Typography>
                    <Typography component="span" color="text.secondary"> = {sumTotalCount().toString()} (Sum Count) * {getPricePerCount()} (Per Count Price)</Typography>
                </Box>
                <Box>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>DAO Reward:</Typography>
                    <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>{gldc(daoReward)}</Typography>
                </Box>

                <TotalShow 
                    lotteryBlockNumber={lotteryBlockNumber}  
                    periods={periods} 
                    currentBlock={currentBlock} 
                    isEth={isEth}
                />
            </Stack>
        </div>

        <div className='border px-3 py-3 mb-3'>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <Stack sx={{ width: isMobile ? '100%' : '75%' }}>
                    <PayCoin 
                        payCoin={payCoin} 
                        setPayCoin={setPayCoin} 
                        setCurrentBlock={setCurrentBlock} 
                        isEth={isEth} 
                        setIsEth={setIsEth}
                    />
                </Stack>

                <Stack sx={{ width: isMobile ? '100%' : '25%', justifyContent: 'center' }} >
                    <Channel channel={channel} setChannel={setChannel}/>
                    <Issue 
                        numberList={numberList} 
                        setNumberList={setNumberList} 
                        multiple={multiple} 
                        periods={periods} 
                        lotteryBlockNumber={lotteryBlockNumber} 
                        payCoin={payCoin} 
                        setPayCoin={setPayCoin} 
                        setCurrentBlock={setCurrentBlock} 
                        channel={channel} 
                        isEth={isEth}
                    />
                </Stack>
            </Stack>
        </div>
    </>
  )
}
