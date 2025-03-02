'use client';

import { useState, useRef, useContext, useEffect } from 'react'
import { GroupBalls, BlueBalls, BraveBalls, RedBalls } from '@/launch/components/balls'
import { BlueCount, BlueMax, RedCount, RedMax, C, BottomNavHeight } from '@/launch/hooks/globalVars'
import { 
    SwipeableDrawer, Table, TableBody, TableRow, TableCell, Button, Paper, 
    Typography, IconButton, Box, TextField, Stack 
} from '@mui/material';
import { IsMobileContext } from '@/hooks/mediaQueryContext';
import { SetBottomSpaceContext } from '@/hooks/bottomSpaceContext';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


const noteCount = (blueBrave, blue, red) => {
    if(blueBrave.length + blue.length >= 6 && red.length >=1){
        return C(blue.length, BlueCount - blueBrave.length) * C(red.length, RedCount);
    }else{
        return 0n;
    }
}

export function sumCount(numberList) {
    let count = 0n;
    for(let i = 0; i < numberList.length; i ++){
        count += noteCount(numberList[i][0], numberList[i][1], numberList[i][2])
    }
    return count;
}

export function BallSelect({numberList, setNumberList}) {

    const [blueBraveBallList, setBlueBraveBallList] = useState([])
    const [blueBallList, setBlueBallList] = useState([])
    const [redBallList, setRedBallList] = useState([])

    const blueRandomCount = useRef(null);
    const redRandomCount = useRef(null);
    
    const isMobile = useContext(IsMobileContext);

    const ballSort = (list) => {
        list.sort((a,b) => {return a-b;});
        return list;
    }

    const initBlueBallList = () => {
        let items = []
        for(let i = 1; i <= BlueMax; i++) {
            let selectedStatus = 0;
            let btnClass = 'btn-outline-primary';
            if(blueBallList.includes(i)){
                selectedStatus = 1;
                btnClass = 'btn-primary btn-blue-light';
            }else if(blueBraveBallList.includes(i)){
                selectedStatus = 2;
                btnClass = 'btn-primary';
            }
            items.push(<a key={i} className={'lottey-ball rounded-circle btn m-1 ' + btnClass} onClick={() => {blueBallSelect(i, selectedStatus)}}>{i}</a>)
        }
        return items;
    } 

    const initRedBallList = () => {
        let items = []
        for(let i = 1; i <= RedMax; i++) {
            let isSelected = redBallList.includes(i);
            items.push(<a key={i} className={'lottey-ball rounded-circle btn m-1 ' + (isSelected ? 'btn-danger' : 'btn-outline-danger')} onClick={() => {redBallSelect(i, isSelected)}}>{i}</a>)
        }
        return items;
}

    const pushBallToList = (list, item) => {
        let newList = [...list]
        newList.push(item);
        newList = [...(new Set(newList))];
        ballSort(newList);
        return newList;
    }

    const getNumberList = (n) => {
        let list = [];
        for(let i = 0; i < n; i ++){
            list.push(i+1);
        }
        return list;
    }

    const blueBallSelect = (val, selectedStatus) => {
        if(selectedStatus == 0){
            setBlueBallList(pushBallToList(blueBallList, val))
        }else if(selectedStatus == 1){
            if(blueBraveBallList.length < BlueCount-1){
                setBlueBraveBallList(pushBallToList(blueBraveBallList, val))
            }
            setBlueBallList(blueBallList.filter((i) => {
                return i != val;
            }))
        }else{
            setBlueBraveBallList(blueBraveBallList.filter((i) => {
                return i != val;
            }))
        }
    }

    const redBallSelect = (val, isSelected) => {
        if(isSelected){
            setRedBallList(redBallList.filter((i) => {
                return i != val;
            }))
        }else if(redBallList.length < RedMax){
            setRedBallList(pushBallToList(redBallList, val))
        }
    }

    const addToNumberList = (item) => {
        if(noteCount(...item) > 0){
            let newList = [...numberList];
            newList.push(item)
            setNumberList(newList);

            setBlueBallList([]);
            setBlueBraveBallList([]);
            setRedBallList([]);
        }
    }

    const randomBall = () => {
        let blue = blueRandomCount.current.value;
        let red = redRandomCount.current.value;                    

        if(blue > BlueMax){
            blue = BlueMax;
            blueRandomCount.current.value = blue;
        }else if(blue < BlueCount){
            blue = BlueCount;
            blueRandomCount.current.value = blue;
        }
        if(red > RedMax){
            red = RedMax;
            redRandomCount.current.value = red;
        }else if(red < RedCount){
            red = RedCount;
            redRandomCount.current.value = red;
        }

        setBlueBraveBallList([])

        let newBlue = []
        while(newBlue.length < blue){
            let n = parseInt(Math.random() * BlueMax) + 1;
            if(!newBlue.includes(n)){
                newBlue.push(n)
            }
        }
        ballSort(newBlue);
        setBlueBallList(newBlue)

        let newRed = []
        while(newRed.length < red){
            let n = parseInt(Math.random() * RedMax) + 1;
            if(!newRed.includes(n)){
                newRed.push(n)
            }
        }
        ballSort(newRed);
        setRedBallList(newRed)

    }


    return (
        <>
            <Box sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction={isMobile ? 'column' : 'row'} spacing={3}>
                    <Box sx={{ width: isMobile ? '100%' : '70%' }}>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">
                            6 Blue Balls or more
                            </Typography>
                            <Box>
                                <Button 
                                    variant="outlined" 
                                    size="small" 
                                    sx={{ mr: 2 }}
                                    onClick={() => {setBlueBraveBallList([]); setBlueBallList(getNumberList(BlueMax));}}
                                >
                                    Select All
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="inherit" 
                                    size="small"
                                    onClick={() => {setBlueBraveBallList([]); setBlueBallList([]);}}
                                >
                                    Deselect All
                                </Button>
                            </Box>
                        </Box>
                        <Box>
                            {initBlueBallList()}
                        </Box>
                    </Box>

                    <Box sx={{ width: isMobile ? '100%' : '30%' }}>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">
                            1 Red Ball or more
                            </Typography>
                            <Box>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    size="small" 
                                    sx={{ mr: 2 }}
                                    onClick={() => {setRedBallList(getNumberList(RedMax))}}
                                >
                                    Select All
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="inherit" 
                                    size="small"
                                    onClick={() => {setRedBallList([])}}
                                >
                                    Deselect All
                                </Button>
                            </Box>
                        </Box>
                        <Box>
                            {initRedBallList()}
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ px: 3, py: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        type="number"
                        label="Blue"
                        defaultValue={BlueCount}
                        sx={{ width: '8rem', input: { min: BlueCount, max: BlueMax, step: 1 } }}
                        inputRef={blueRandomCount}
                    />
                    <TextField
                        size="small"
                        type="number"
                        label="Red"
                        defaultValue={RedCount}
                        sx={{ width: '8rem', input: { min: RedCount, max: RedMax, step: 1 } }}
                        inputRef={redRandomCount}
                    />
                    <Button 
                        variant="outlined" 
                        color="inherit"
                        onClick={() => {randomBall()}}
                    >
                        Random Balls
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ p: 1, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={2} direction="row">
                    <Stack spacing={2} direction="row" sx={{ width: "80%", alignItems: 'center' }}>
                        {blueBraveBallList.length > 0 && (
                            <div>
                                <BraveBalls numberList={blueBraveBallList}/>
                            </div>
                        )}
                        <div>
                            <BlueBalls numberList={blueBallList}/>
                        </div>
                        <div>
                            <RedBalls numberList={redBallList}/>
                        </div>
                    </Stack>
                    <div>
                        <Box sx={{ my: 1 }}>
                            Count: {noteCount(blueBraveBallList, blueBallList, redBallList).toString()}
                        </Box>
                        <Button
                            variant="outlined"
                            color="success"
                            disabled={noteCount(blueBraveBallList, blueBallList, redBallList) == 0n}
                            onClick={() => {addToNumberList([blueBraveBallList, blueBallList, redBallList])}}
                        >
                            Confirm
                        </Button>
                    </div>
                </Stack>
            </Box>
        </>
    )
}

export function BallGroup({numberList, setNumberList}) {
    const headerHeight = 52; // 标题栏高度
    const maxContentHeight = 160;

    const isMobile = useContext(IsMobileContext);
    const setBottomSpace = useContext(SetBottomSpaceContext);
    const [contentHeight, setContentHeight] = useState(headerHeight);
    const tableRef = useRef(null);
    
    const removeFromNumberList = (index) => {
        setNumberList(numberList.filter((l, i) => {
            return i != index;
        }))
    }

    const ballGroupContent = () => (
        <>
            <Table ref={tableRef}>
                <TableBody>
                    {numberList.map((item, index) => (
                        <TableRow 
                            key={index}
                            sx={{
                                '&:last-child td': { borderBottom: 'none' }
                            }}
                        >
                            <TableCell sx={{ width: '80%' }}>
                                <GroupBalls numberLists={item}/>
                            </TableCell>
                            <TableCell>
                                <div className='mb-2'>
                                    Count: {noteCount(item[0], item[1], item[2]).toString()}
                                </div>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    size="small"
                                    onClick={() => {removeFromNumberList(index)}}
                                >
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

    const getContentHeight = () => {
        const tableHeight =!!tableRef.current? tableRef.current.getBoundingClientRect().height : 0;
        const contentHeight = tableHeight + headerHeight;
        return contentHeight;
    }

    const getMaxContentHeight = (contentHeight) => {
        return Math.min(contentHeight, maxContentHeight);
    }

    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        if (isMobile) {
            const contentHeight = getContentHeight();
            const maxHeight = getMaxContentHeight(contentHeight);
            setBottomSpace(maxHeight);
            setContentHeight(contentHeight);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, numberList]);

    return isMobile ? (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    bottom: `${BottomNavHeight}px`,
                    height: open ? `${contentHeight}px` : `${getMaxContentHeight(contentHeight)}px`,
                    overflow: 'hidden',
                    transform: 'none !important',
                    transition: 'height 225ms cubic-bezier(0, 0, 0.2, 1) !important'
                }
            }}
        >
            <Paper elevation={3} sx={{
                visibility: 'visible',
                pointerEvents: 'auto'   
            }}>
                <Box 
                    onClick={toggleDrawer(!open)}
                    sx={{ 
                        border: 'solid rgba(0, 0, 0, 0.12)',
                        borderWidth: '1px 0px 1px 0px'
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            px: 2,
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        Selected Balls ( {numberList.length} groups )
                        <IconButton size="small">
                            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                        </IconButton>
                    </Typography>
                </Box>
                <Box sx={{                     
                    maxHeight: open ? 'auto' : `${maxContentHeight - headerHeight}px`,
                    overflow: 'auto'
                }}>
                    {ballGroupContent()}
                </Box>
            </Paper>
        </SwipeableDrawer>
    ) : (
        <Box sx={{ p: 1, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            {ballGroupContent()}
        </Box>
    );
}