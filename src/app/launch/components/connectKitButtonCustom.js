'use client';

import { useState, useContext } from 'react'
import { ConnectKitButton, Avatar } from "connectkit";
import { IsDesktopContext } from '@/hooks/mediaQueryContext';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

export default function ConnectKitButtonCustom() {

    const isDesktop = useContext(IsDesktopContext);
     
  return (
    <> 
    <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, truncatedAddress }) => {
            return (
                <button onClick={show} className='btn btn-light' type='button'>
                    {isConnected ? (
                        <div className='d-flex align-items-center'>
                            <Avatar address={address} size={24} />
                            {isDesktop && (
                                <span className='ms-2 fs-5'>{truncatedAddress}</span>
                            )}
                        </div>
                    ) : (
                        <>
                        <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24 }} className='align-text-top'/>
                        <span className='ms-2 fs-5 align-text-top'>Connect Wallet</span>
                        </>
                    )}
                </button>
            );
        }}

    </ConnectKitButton.Custom>
    </>

  )
}

