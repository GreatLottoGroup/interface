'use client';

import { useState, useEffect } from 'react'
import useSalesChannel from '@/launch/hooks/contracts/SalesChannel'
import {shortAddress} from '@/launch/hooks/globalVars'

export default function Channel({channel, setChannel}) {

    const [channelData, setChannelData] = useState({})

    const { getChannelById, statusEl } = useSalesChannel()


    const getChannel = async () => {
        let chn = (new URL(window.location.href)).searchParams.get('chn');
        console.log(chn);
        if(Number(chn) != NaN && Number(chn) > 0){
            chn = Number(chn);
            let [status, addr, name] = await getChannelById(chn);
            console.log(status, addr, name)
            if(status){
                setChannel(chn);
                setChannelData({chn, status, addr, name});
            }
        }else{
            console.log('no channel')
        }
    }

    useEffect(() => {

        console.log('useEffect~')
        getChannel();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (

    <>  
        {channel > 0 && channelData.status && (
            <>
            <div>Sales Channel: {statusEl(true)}</div>
            <div>Channel Id: {channelData.chn}</div>
            <div className='mb-3'>Channel Name: {channelData.name} ( {shortAddress(channelData.addr)} )</div>
            </>
        )}


    </>

    )
}