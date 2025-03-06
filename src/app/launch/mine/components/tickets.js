'use client';

import './tickets.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, Box, Dialog, DialogTitle, DialogContent, Chip, SwipeableDrawer } from '@mui/material';

import { useState, useEffect, useContext } from 'react'
import { useConfig, useAccount } from 'wagmi'

import { drawTicketList } from '@/launch/hooks/drawNumbers'
import { dateFormatLocal } from '@/launch/hooks/dateFormat'

import { BlockPeriods, IssueInterval, getBlockTime, BottomNavHeight } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"

import { Ball } from '@/launch/components/balls'
import { usePageNav, PageNav } from '@/launch/hooks/pageNav'

import useGreatLottoNft from '@/launch/hooks/contracts/GreatLottoNft'
import useCurrentBlock  from '@/launch/hooks/currentBlock'
import Card from '@/launch/components/card'
import List from '@/launch/components/list'
import { coinShow, glc, gleth, amount, address } from "@/launch/components/coinShow"
import Tooltips from "@/launch/components/tooltips"
import {useTargetBlock} from '@/launch/hooks/targetBlock'
import BlockStatus from '@/launch/components/blockStatus'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import { IsMobileContext } from '@/hooks/mediaQueryContext';

export default function Tickets() {

    const config = useConfig();
    const {currentBlock, setCurrentBlock} = useCurrentBlock()
    const chainId = config.state.chainId;
    const { address: accountAddress } = useAccount()

    const { getTokenName, GreatNftContractAddress } = useAddress();

    const [nftList, setNftList] = useState([])
    const [tickets, setTickets] = useState({})
    const [ticketsShow, setTicketsShow] = useState({})
    const [statusShow, setStatusShow] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [NFTSVGAddress, setNFTSVGAddress] = useState();

    const { getNftSVG, getNFTSVGAddress } = useGreatLottoNft()

    const { getPageNavInfo, pageCurrent, pageCount, setPageCurrent, pageSize } = usePageNav()

    const {getBlockListByNumbersFromServer, getTicketsByOwnerFromServer} = useTargetBlock()

    const isMobile = useContext(IsMobileContext);

    const getNftList = async (page) => {

        page = page || pageCurrent;
        
        const {result, count} = await getTicketsByOwnerFromServer(accountAddress, page, pageSize);
        
        getPageNavInfo(count);
        
        let blockNumbers = [];
        for(let i = 0; i < result.length; i++){
            let _ticket = result[i];
            for(let j = 0; j < _ticket.periods; j++){
                let bn = BigInt(_ticket.targetBlockNumber) + IssueInterval*BigInt(j);
                if(blockNumbers.indexOf(bn) == -1){
                    blockNumbers.push(bn)
                }
            }
        }
        
        const targetBlocks = await getBlockListByNumbersFromServer(blockNumbers);

        const targetBlocksMap = {};

        for(let i = 0; i < targetBlocks.length; i++){
            let bn = targetBlocks[i].blockNumber;
            targetBlocksMap[bn] = targetBlocks[i]
        }
        
        let list = [];

        for(let i = 0; i < result.length; i++){
            let _ticket = result[i];
            let _targetBlocks = [];
            for(let j = 0; j < _ticket.periods; j++){
                let bn = BigInt(_ticket.targetBlockNumber) + IssueInterval*BigInt(j);
                _targetBlocks.push(targetBlocksMap[bn]);
            }
            list.push({ targetBlocks: _targetBlocks, ..._ticket })
        }

        //console.log(list)
        setNftList(list);

        return list;

    }

    const getTicket = async (token) => {
        if(!tickets[token.toString()]){
            let svg = await getNftSVG(token);
            let newList = {...tickets};
            newList[token.toString()] = svg
            setTickets(newList);
        }
    }

    const getOpenSeaUrl = (tokenId) => {
        let url;
        if(chainId == 11155111){
            url = 'https://testnets.opensea.io/assets/sepolia/'
        }else{
            url = 'https://opensea.io/assets/'
        }
        url += GreatNftContractAddress + '/' + tokenId;
        return url;
    }

    const toggleTicketShow = (token, isShow) => {
        token = token.toString()
        let newData = {...ticketsShow};
        newData[token] = isShow;
        setTicketsShow(newData)
    }

    const toggleStatusShow = (token, isShow) => {
        token = token.toString()
        let newData = {...statusShow};
        newData[token] = isShow;
        setStatusShow(newData)
    }


    const getIsDrawFormDrawList = (targetBlocks, num, isBlue) => {
        let isDraw = false
        for(let i = 0; i < targetBlocks.length; i++){
            if(isBlue){
                if(targetBlocks[i].drawNumber.slice(0,6).indexOf(num) > -1){
                    isDraw = true;
                    break;
                }
            }else{
                if(targetBlocks[i].drawNumber[6] == num){
                    isDraw = true;
                    break;
                }
            }
        }
        return isDraw;
    }

    const getIsDrawFormNumsList = (numsList, num, isBlue) => {
        let isDraw = false
        for(let i = 0; i < numsList.length; i++){
            if(isBlue){
                if(numsList[i][0].indexOf(num) > -1 || numsList[i][1].indexOf(num) > -1){
                    isDraw = true;
                    break;
                }
            }else{
                if(numsList[i][2].indexOf(num) > -1){
                    isDraw = true;
                    break;
                }
            }
        }
        return isDraw;
    }

    const getWinNumbers = (numsList, block) => {
        console.log('getWinNumbers: ', numsList, block)

        if(block.blockNumber >= currentBlock.number - BlockPeriods){
            let time = getBlockTime(block.blockNumber, currentBlock)
            if(time){
                return amount(dateFormatLocal(time), true);
            }else{
                return '-'
            }
        }else{
            let drawNumber = block.drawNumber;
            //test
            /*
            drawNumber[0] = 32
            drawNumber[1] = 33
            drawNumber[2] = 34
            drawNumber[3] = 35
            drawNumber[4] = 36
            drawNumber[5] = 37
            drawNumber[6] = 14
            */
            drawNumber = [...drawNumber.slice(0, 6).sort((a,b) => {return a-b;}), drawNumber[6]]

            return (
            <>
                {drawNumber.map((num, i) => (
                    <Ball number={num} key={i} type={i < 6 ? 'brave' : 'red'} isDraw={getIsDrawFormNumsList(numsList, num, i < 6)}/>
                ))}
            </>
            )
        }

    }

    const getDrawDetail = (numsList, block, isEth) => {
        if(block.blockNumber >= currentBlock.number - BlockPeriods){
            return '-'
        }else{
            let drawNumber = block.drawNumber;    
            let [bonus, topBonus] = drawTicketList(numsList, drawNumber, isEth);
    
            return (
            <>
                 {(bonus == 0 && topBonus == 0) ? (
                    <Chip label="Losing Lottery" color="error" size="small" variant="outlined" />
                ) : (
                    <Stack direction="column" spacing={1}>
                        <Typography>Normal Award: {isEth ? gleth(bonus) : glc(bonus)}</Typography>
                        <Typography>Top Bonus: {amount(topBonus, true)}</Typography>
                    </Stack>
                )}
            </>
            )
        }
    }

    const getDrawStatus = (block) => {
        let drawStatus;
        if(!currentBlock.number){
            return;
        }
        if(block.blockNumber >= Number(currentBlock.number - BlockPeriods)){
            drawStatus = 'waitingDraw'
        }else if(block.isDraw){
            drawStatus = 'drawn'
        }else if(block.isRollup){
            drawStatus = 'rolled'
        }else if(block.blockNumber >= Number(currentBlock.number - 256n)){
            drawStatus = 'waitingDraw'
        }else{
            drawStatus = 'waitingRollup'
        }

        return drawStatus
        
    }

    const initNftList = async () => {
        setIsLoading(true)
        await getNftList()
        setNFTSVGAddress(await getNFTSVGAddress())
        setIsLoading(false)
    }

    const ticketDialogContent = (item) => {
        return (
            <>
                <Typography color="text.secondary" gutterBottom>GreatLottoNFT: {address(GreatNftContractAddress)}</Typography>
                <Typography color="text.secondary" gutterBottom>GreatLottoNFTSVG: {address(NFTSVGAddress)}</Typography>
                <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="flex-start" sx={{mt: 3}}>
                    <Box sx={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                        {tickets[item.tokenId.toString()] ? (
                            <a target='_blank' href={getOpenSeaUrl(item.tokenId.toString())}>
                                <div className='nft-ticket-svg text-center' dangerouslySetInnerHTML={{__html:tickets[item.tokenId.toString()]}}></div>
                            </a>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </Box>                                    
                        )}
                    </Box>
                    <Stack direction={isMobile ? "row" : "column"} spacing={isMobile ? 2 : 1} alignItems="flex-start" useFlexGap sx={{ flexWrap: 'wrap' }}>  
                        <Typography noWrap>TokenId: {amount(item.tokenId, true)}</Typography>
                        <Typography noWrap>Multiple: {amount(item.multiple, true)}</Typography>
                        <Typography noWrap>Periods: {amount(item.periods, true)}</Typography>
                        <Typography noWrap>Target Block: {amount(item.targetBlockNumber, true)}</Typography>
                        <Typography noWrap>Counts: {amount(item.count, true)}</Typography>
                        <Typography noWrap>Price: {coinShow(getTokenName(item.payToken), item.amount, !item.isEth)}</Typography>
                        <Typography noWrap>Channel: {amount(item.channelId, true)}</Typography>
                    </Stack>
                </Stack>
            </>
        )
    }

    const ticketContent = (item) => {
        return (
            <>
                <Chip icon={<ConfirmationNumberOutlinedIcon />} label={"TokenId: " + item.tokenId.toString()} onClick={()=>{getTicket(item.tokenId);toggleTicketShow(item.tokenId, true)}} size="small" />
                {isMobile ? (
                    <SwipeableDrawer
                        anchor="bottom"
                        open={ticketsShow[item.tokenId.toString()]}
                        onClose={()=>{toggleTicketShow(item.tokenId, false)}}
                        sx={{
                            '& .MuiDrawer-paper': {
                                bottom: `${BottomNavHeight}px`,
                            }
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{mb: 2}}>Ticket Detail</Typography>
                            {ticketDialogContent(item)}
                        </Box>
                    </SwipeableDrawer>
                ) : (
                    <Dialog
                        open={ticketsShow[item.tokenId.toString()]}
                        maxWidth="lg"
                        onClose={()=>{toggleTicketShow(item.tokenId, false)}}
                    >
                        <DialogTitle>Ticket Detail</DialogTitle>
                        <DialogContent>
                            {ticketDialogContent(item)}
                        </DialogContent>
                    </Dialog>
                )}
            </>
        )
    }

    const drawDetailDialogContent = (item) => {
        return (
            <TableContainer>
                <Table sx={{ width: '100%' }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Target Block</TableCell>
                            <TableCell>Winning Numbers</TableCell>
                            {!isMobile && (<TableCell>Status</TableCell>)}
                            {!isMobile && (<TableCell>Award</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {currentBlock.number && (item.targetBlocks.map((block, i)=>                                
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                                <Stack direction="column" spacing={1} alignItems="flex-start">
                                    {amount(block.blockNumber, true)}
                                    {isMobile && (
                                        <BlockStatus status={getDrawStatus(block)} hasDetail={false} />
                                    )}
                                    {isMobile && (
                                        <>{getDrawDetail(item.numbers, block, item.isEth)}</>
                                    )}
                                </Stack>
                            </TableCell>
                            <TableCell>{getWinNumbers(item.numbers, block)}</TableCell>
                            {!isMobile && (<TableCell>
                                <BlockStatus status={getDrawStatus(block)} hasDetail={false} />
                            </TableCell>)}
                            {!isMobile && (<TableCell>{getDrawDetail(item.numbers, block, item.isEth)}</TableCell>)}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const drawDetailContent = (item) => {
        return (
            <>
                <BlockStatus status={getDrawStatus(item.targetBlocks[0])} hasDetail={true} toggleDetailShow={()=>{toggleStatusShow(item.tokenId, true)}} />
                {isMobile ? (
                    <SwipeableDrawer
                        anchor="bottom"
                        open={statusShow[item.tokenId.toString()]}
                        onClose={()=>{toggleStatusShow(item.tokenId, false)}}
                        sx={{
                            '& .MuiDrawer-paper': {
                                bottom: `${BottomNavHeight}px`,
                            }
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{mb: 2}}>Draw Status TokenId: {item.tokenId.toString()}</Typography>
                            {drawDetailDialogContent(item)}
                        </Box>
                    </SwipeableDrawer>
                ) : (
                    <Dialog 
                        open={statusShow[item.tokenId.toString()]} 
                        maxWidth="lg" 
                        onClose={()=>{toggleStatusShow(item.tokenId, false)}}
                    >
                        <DialogTitle>
                            Draw Status TokenId: {item.tokenId.toString()}
                        </DialogTitle>
                        <DialogContent>
                            {drawDetailDialogContent(item)}
                        </DialogContent>
                    </Dialog>
                )}
            </>
        )
    }

    useEffect(()=>{

        console.log('useEffect~')
        initNftList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, pageCurrent])


  return (
    <>
        <Card title="My Tickets" subTitle={currentBlock.number?.toString()} reload={async ()=>{setCurrentBlock(); await initNftList();}}>
            <List list={nftList} isLoading={isLoading}>
                <TableContainer>
                    <Table sx={{ width: '100%' }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ticket</TableCell>
                                <TableCell>Numbers</TableCell>
                                {!isMobile && (<TableCell>Status</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {nftList.map((item, index) => (
                            <TableRow key={index} 
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                            >
                                <TableCell>
                                    <Stack direction="column" spacing={1} alignItems="flex-start">
                                        {ticketContent(item)}
                                        {isMobile && drawDetailContent(item)}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {item.numbers.map((ball, bi) => (
                                        <Stack key={bi} direction="row" spacing={1} alignItems="center" sx={{minWidth: 300, flexWrap: 'wrap'}}>
                                            {ball[0].map((num, i) => (
                                                <Ball number={num} key={i} type="brave" isDraw={getIsDrawFormDrawList(item.targetBlocks, num, true)}/>
                                            ))}
                                            {ball[1].map((num, i) => (
                                                <Ball number={num} key={i} type="blue" isDraw={getIsDrawFormDrawList(item.targetBlocks, num, true)}/>
                                            ))}
                                            {ball[2].map((num, i) => (
                                                <Ball number={num} key={i} type="red" isDraw={getIsDrawFormDrawList(item.targetBlocks, num, false)}/>
                                            ))}
                                        </Stack>
                                    ))}
                                </TableCell>
                                {!isMobile && (
                                    <TableCell>
                                        {drawDetailContent(item)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ mt: 2 }}>
                        <PageNav pageCount={pageCount} pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} />
                    </Box>
                </TableContainer>
            </List>
        </Card> 


    </>

  )
}

