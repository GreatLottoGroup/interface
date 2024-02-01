'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { ConnectKitButton } from "connectkit";

import IssueTicket from '../issue/issueTicket'


export default function Main() {

    const [conectedStatus, setConectedStatus] = useState(false);

    const { isConnected } = useAccount()

    useEffect(() => {
        setConectedStatus(isConnected);
    }, [isConnected])

  return (

    <div className='container px-5'>

        {conectedStatus ? (
            <IssueTicket />
        ):(
            <ConnectKitButton />
        )}

    </div>

  )
}
