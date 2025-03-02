'use client';

import { useState, useEffect, useRef, useContext } from 'react'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import { 
    Stack, Box, Select, MenuItem, TextField, Button, ButtonGroup,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, Typography, SwipeableDrawer
} from '@mui/material';

import Card from '@/launch/components/card'
import List from '@/launch/components/list'
import { DrawGroupBalls } from '@/launch/components/balls'
import { BlockPeriods, getBlockTime, BottomNavHeight } from '@/launch/hooks/globalVars'
import { usePageNav, PageNav } from '@/launch/hooks/pageNav'
import {useTargetBlock} from '@/launch/hooks/targetBlock'
import { drawTicketList } from '@/launch/hooks/drawNumbers'
import { glc, gleth, amount, address } from "@/launch/components/coinShow"
import { dateFormatLocal } from '@/launch/hooks/dateFormat'
import BlockStatus from '@/launch/components/blockStatus'
import { IsMobileContext } from '@/hooks/mediaQueryContext';

export default function BlockList({currentBlock}) {

    const config = useConfig();

    const [showList, setShowList] = useState([])
    const [curStatus, setCurStatus] = useState('all')
    const {listStatus, getBlockListFromServer, getBlockListByStatusFromServer, searchBlockFromServer, getTicketsByTokensFromServer} = useTargetBlock()

    const [isLoading, setIsLoading] = useState(false);

    const [drawDetailShow, setDrawDetailShow] = useState({})

    const blockSearchEl = useRef(null)

    const isMobile = useContext(IsMobileContext);

    const { getPageNavInfo, pageCurrent, pageCount, setPageCurrent, pageSize } = usePageNav()

    const _showBlock = async  (info, curBlockNumber) => {
        let maxNumber = curBlockNumber - BlockPeriods;
        console.log(info);
        // drawNumber
        if(info.status != 'drawn' && info.blockNumber <= maxNumber){
            let numberList = [];
            let ticketList = await getTicketsByTokensFromServer(info.tickets);
            for (let ti = 0; ti < ticketList.length; ti++) {
                let t = ticketList[ti];
                numberList = [...numberList, ...t.numbers]
            }
            [info.normalAwardSumAmount, info.topBonusMultiples] = drawTicketList(numberList, info.drawNumber, false);
            [info.normalAwardSumAmountByEth, info.topBonusMultiplesByEth] = drawTicketList(numberList, info.drawNumber, true);
        }
        return info;

    }

    const _showBlockList = async (list) => {
        let curBlockNumber = await getBlockNumber(config);
        let _list = [];
        for (let i = 0; i < list.length; i++) {
            let info = await _showBlock(list[i], curBlockNumber);
            _list.push(info);
        }
        return _list;
    }

    const searchBlock = async (blockNumber) => {
        let result = await searchBlockFromServer(blockNumber);
        setShowList(await _showBlockList(result));
        getPageNavInfo(1);
    }
    
    const showListByStatus = async (status, page) => {
        let result, count;
        status = status || curStatus;
        page = page || pageCurrent;
        
        if(status == 'all'){
            ({result, count} = await getBlockListFromServer(page, pageSize));
        }else{
            ({result, count} = await getBlockListByStatusFromServer(status, null, page, pageSize));
        }

        getPageNavInfo(count);

        setShowList(await _showBlockList(result));
    }

    const toggleDetailShow = (blockNumber, isShow) => {
        blockNumber = blockNumber.toString()
        let newData = {...drawDetailShow};
        newData[blockNumber] = isShow;
        setDrawDetailShow(newData);
    }

    const initBlockList = async () => {
        setIsLoading(true)
        if(curStatus){
            await showListByStatus()
        }
        setIsLoading(false)
    }

    const getBlockDrawTime =  (blockNumber) => {
        const time = getBlockTime(blockNumber, currentBlock)
        if(time){
            return dateFormatLocal(time)
        }else{
            return '-'
        }
    }

    const detailTableContent = (item) => {
        return (
        <>
            <TableContainer>
                <Table sx={{ width: '100%' }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Award</TableCell>
                            <TableCell>Award Eth</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1" gutterBottom>
                                    Normal Award Sum Amount: {glc(item.normalAwardSumAmount)}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Top Bonus Count: {amount(item.topBonusMultiples || 0)}
                                </Typography>
                                {(item.isDraw || item.isRollup) && (
                                    <Typography variant="subtitle1">
                                        Top Bonus Sum Amount: {glc(item.topBonusSumAmount)}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" gutterBottom>
                                    Normal Award Sum Amount: {gleth(item.normalAwardSumAmountByEth)}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Top Bonus Count: {amount(item.topBonusMultiplesByEth || 0)}
                                </Typography>
                                {(item.isDraw || item.isRollup) && (
                                    <Typography variant="subtitle1">
                                        Top Bonus Sum Amount: {gleth(item.topBonusSumAmountByEth)}
                                    </Typography>
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {(item.isDraw || item.isRollup) && (
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Opener: {address(item.opener)}
                </Typography>   
            )}
        </>
        )
    }

    const drawDetailContent = (item) => {
        const hasDetail = item.drawNumber && item.drawNumber.length > 0 && item.drawNumber[0] > 0
        return (
        <>
            <BlockStatus status={item.status} hasDetail={hasDetail} toggleDetailShow={hasDetail ? ()=>{toggleDetailShow(item.blockNumber, true)} : null } />    
            {hasDetail && (
                isMobile ? (
                    <SwipeableDrawer
                        anchor="bottom"
                        open={drawDetailShow[item.blockNumber.toString()]}
                        onClose={()=>{toggleDetailShow(item.blockNumber, false)}}
                        sx={{
                            '& .MuiDrawer-paper': {
                                bottom: `${BottomNavHeight}px`,
                            }
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6">
                                Block Number: {item.blockNumber.toString()}
                            </Typography>
                            {detailTableContent(item)}
                        </Box>
                    </SwipeableDrawer>
                ) : (
                    <Dialog 
                        open={drawDetailShow[item.blockNumber.toString()]} 
                        maxWidth="lg" 
                        onClose={()=>{toggleDetailShow(item.blockNumber, false)}}
                    >
                        <DialogTitle>
                            Block Number: {item.blockNumber.toString()}
                        </DialogTitle>
                        <DialogContent>
                            {detailTableContent(item)}
                        </DialogContent>
                    </Dialog>
                )
            )}
        </>
        )
    }


    useEffect(()=>{

        console.log('useEffect~')

        initBlockList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageCurrent, curStatus])

    return (
    <>
        <Card title="Block List" subTitle={currentBlock.number?.toString()} reload={()=>{
            initBlockList();
        }}>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: 200 }}>
                        <Select
                            size="small"
                            fullWidth
                            value={curStatus}
                            onChange={(e)=>{
                                let status = e.target.value;
                                console.log(status)
                                setCurStatus(status);
                                setPageCurrent(1);
                            }}
                        >
                            {Object.keys(listStatus).map((v, i) => 
                                <MenuItem key={i} value={v}>{listStatus[v].name}</MenuItem>
                            )}
                        </Select>
                    </Box>
                    <Stack direction="row" sx={{ width: '100%', justifyContent: 'flex-end' }}>
                        <ButtonGroup variant="outlined" size="small">
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Block Number..."
                                type="number"
                                inputRef={blockSearchEl}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0
                                    }
                                }}
                            />
                            <Button
                                onClick={()=>{
                                    let blockNumber = blockSearchEl.current.value
                                    if(blockNumber){
                                        setCurStatus(null);
                                        setPageCurrent(1);
                                        searchBlock(blockNumber);
                                        blockSearchEl.current.value = ''
                                    }
                                }}
                            >
                                Search
                            </Button>
                        </ButtonGroup>
                    </Stack>
                </Stack>

                <List list={showList} isLoading={isLoading}>
                    <TableContainer>
                        <Table sx={{ width: '100%' }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Block Info</TableCell>
                                    <TableCell>Block Prize</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Draw Info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {showList.map((item, i) => 
                                <TableRow key={i} 
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                                >
                                    <TableCell>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Block Number: {amount(item.blockNumber, true)}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Tickets: {amount(item.tickets.length, true)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Block Prize: {glc(item.blockBalance)}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Block Eth Prize: {gleth(item.blockBalanceEth)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{drawDetailContent(item)}</TableCell>
                                    <TableCell>
                                        {item.drawNumber && item.drawNumber.length > 0 && item.drawNumber[0] > 0 ? (
                                        <>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <DrawGroupBalls drawNumbers={item.drawNumber}/>
                                            </Stack>
                                        </>
                                        ) : getBlockDrawTime(item.blockNumber)}
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                        <Box sx={{ mt: 2 }}>
                            <PageNav pageCount={pageCount} pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} />
                        </Box>
                    </TableContainer>
                </List>
            </Stack>
        </Card>
    </>
    )
}

