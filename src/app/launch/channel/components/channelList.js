'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { isOwner } from '@/launch/hooks/globalVars'
import Card from '@/launch/components/card'
import useSalesChannel from '@/launch/hooks/contracts/SalesChannel'
import { address } from "@/launch/components/coinShow"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material'

export default function ChannelList({hasActions}) {

    const { address: accountAddress } = useAccount()

    const [channelList, setChannelList] = useState([])

    const { getChannelById, statusEl, getChannelCount, disableChannel, enableChannel, isLoading, isPending } = useSalesChannel()

    const getChannelList = async () => {
        let count = await getChannelCount();
        let list = [];
        count = Number(count)
        if(count > 0){
            for(let i = 1; i <= count; i++){
                let [status, address, name] = await getChannelById(i);
                if(address){
                    list.push({
                        id: i,
                        address,
                        name,
                        status
                    })
                }
            }
            setChannelList(list)
        }
    }

    const disableChannelExecute = async (id) => {
        if(id > 0 && isOwner(accountAddress)){
            let tx = await disableChannel(id);
            if(tx){
                await getChannelList()
            }
        }
    }

    const enableChannelChannelExecute = async (id) => {
        if(id > 0 && isOwner(accountAddress)){
            let tx = await enableChannel(id);
            if(tx){
                await getChannelList()
            }
        }
    }

    useEffect(() => {

        console.log('useEffect~')
        getChannelList();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress])

    return (
    <>  
        <Card title="Sales Channel List" reload={getChannelList}>
            <TableContainer >
                <Table sx={{ minWidth: '100%' }}  size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Status</TableCell>
                            {hasActions && isOwner(accountAddress) && (
                                <TableCell>Action</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {channelList.map((item, i) => (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                            <TableCell>{item.id.toString()}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{address(item.address)}</TableCell>
                            <TableCell>{statusEl(item.status)}</TableCell>
                            {hasActions && isOwner(accountAddress) && (
                                <TableCell>
                                {item.status ? (
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        size="small" 
                                        disabled={isLoading || isPending}
                                        onClick={() => disableChannelExecute(item.id)}
                                    >
                                        Disable {(isLoading || isPending) ? '...' : ''}
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        size="small" 
                                        disabled={isLoading || isPending}
                                        onClick={() => enableChannelChannelExecute(item.id)}
                                    >
                                        Enable {(isLoading || isPending) ? '...' : ''}
                                    </Button>
                                )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    </>
    )

}