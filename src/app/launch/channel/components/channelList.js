'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'

import { isOwner } from '@/launch/hooks/globalVars'
import Card from '@/launch/components/card'

import useSalesChannel from '@/launch/hooks/contracts/SalesChannel'

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
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Status</th>
                        {hasActions && isOwner(accountAddress) && (
                            <th>Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                {channelList.map((item, i) => 
                    <tr key={i}>
                        <td>{item.id.toString()}</td>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>{statusEl(item.status)}</td>
                        {hasActions && isOwner(accountAddress) && (
                            <td>
                            {item.status ? (
                                <button type="button" disabled={isLoading || isPending} className='btn btn-danger btn-sm' onClick={()=>{disableChannelExecute(item.id)}}> Disable {(isLoading || isPending) ? '...' : ''}</button>
                            ) : (
                                <button type="button" disabled={isLoading || isPending} className='btn btn-success btn-sm' onClick={()=>{enableChannelChannelExecute(item.id)}}> Enable {(isLoading || isPending) ? '...' : ''}</button>
                            )}
                            </td>
                        )}
                    </tr>
                )}
                </tbody>
            </table>
        </Card>
    </>
    )

}