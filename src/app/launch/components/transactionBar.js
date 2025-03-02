'use client';

import './transactionBar.css'

import { useContext, useState } from 'react';
import { DarkContext } from '@/hooks/darkContext';

import { useConfig } from 'wagmi'
import { watchChainId } from '@wagmi/core'
import { Menu, MenuItem, IconButton, Stack, SwipeableDrawer } from '@mui/material';
import { chains } from '@/launch/hooks/globalVars'
import { ChainIcon  } from 'connectkit';
import { IsMobileContext, IsDesktopContext } from '@/hooks/mediaQueryContext';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LightBtn } from './lightBtn';

export default function TransactionBar({transactions, checkTransactions, hasPendingTrans, delTransaction}) {
    
    const isDark = useContext(DarkContext)

    const config = useConfig();
    
    const chainId = config.state.chainId;
    const chainName = chains[chainId];

    const isMobile = useContext(IsMobileContext);
    const isDesktop = useContext(IsDesktopContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const statusElm = (s) => {
        if(s == 'success'){
            return <div className='trans-status text-success text-capitalize'>{s}</div>
        }else if(s == 'reverted'){
            return <div className='trans-status text-danger text-capitalize'>{s}</div>
        }else{
            return (
                <div className="trans-status text-warning">
                    <span className='text-capitalize'>{s}</span>
                    <div className="spinner-border spinner-border-sm ms-1 align-bottom"></div>
                </div>
            )
        }
    }

    const tipElm = () => {
        let hasPending = hasPendingTrans(transactions);
        if(hasPending > -1){
            return <span className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"></span>
        }else{
            return ''
        }
    }

    const getTransLink = (hash) => {
        let perHost = ''
        if(chainId == 11155111 || chainId == 17000){
            perHost = chainName + '.'
        }
        return 'https://' + perHost + 'etherscan.io/tx/' + hash;
    }

    const transactionsList = () => {
        if(transactions.length > 0){
            let _transactions = [...transactions];
            _transactions.reverse();
            return (_transactions.map((trans, i) => 
                <MenuItem 
                    key={i} 
                    component="a" 
                    href={getTransLink(trans.hash)} 
                    target="_blank"
                    sx={{ 
                        borderBottom: i === _transactions.length - 1 ? 'none' : '1px solid #eee'
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ 
                        width: '100%'
                    }}>
                        <div className="trans-action text-capitalize">{trans.action}</div>
                        <Stack direction="column" alignItems="flex-end">
                            {statusElm(trans.status)}
                            <div className='trans-time text-secondary'>{trans.time}</div>
                        </Stack>
                    </Stack>
                </MenuItem>
            ))
        }else{
            return <MenuItem disabled>No Transactions</MenuItem>
        }
    }

    const transActionBar = () => {
        return (
            <MenuItem sx={{ borderBottom: '1px solid #ddd' }}>
                <div className='trans-action-bar'>
                    <span className='trans-action-title'>Your Transaction</span>
                    <div>
                    <IconButton size="small" onClick={checkTransactions}>
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={delTransaction}>
                        <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                </div>
            </MenuItem>
        )
    }

    watchChainId(config, {
        onChange(chainId) {
          window.location.reload();
        }
    })
 
    return (
    <>
    <LightBtn
        className="ms-3"
        onClick={handleClick}
        variant='outlined'
        sx={{ textTransform: 'none' }}
        aria-controls={open ? 'transactions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        disableFocusRipple
        disableRipple
    >
        <div className='align-text-top d-inline-block'>
            <ChainIcon id={chainId}/>
        </div>
        {isDesktop && (
            <span className='text-capitalize align-text-top fs-5 ms-2'>{chainName}</span>
        )}
        {tipElm()}
    </LightBtn>

    {isMobile ? (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={handleClose}
            sx={{ zIndex: 99999 }}
        >
            {transActionBar()}
            {transactionsList()}
        </SwipeableDrawer>
    ) : (
        <Menu
            id="transactions-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: '25rem',
                    },
                },
            }}
        >
            {transActionBar()}
            {transactionsList()}
        </Menu>
    )}
    </>
  
    )
  }
  