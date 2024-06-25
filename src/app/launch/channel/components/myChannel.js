'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import Card from '@/launch/components/card'
import useSalesChannel from '@/launch/hooks/contracts/SalesChannel'
import WriteBtn from '@/launch/components/writeBtn'

export default function MyChannel() {

    const { address: accountAddress } = useAccount()

    const [channelData, setChannelData] = useState({})
    const channelNameEl = useRef(null)

    const { getChannelByAddr, statusEl, registerChannel, changeChannelName, isLoading, isPending } = useSalesChannel()


    const getMyChannel = async () => {
        let [status, chnId, name] = await getChannelByAddr();

        if(chnId > 0){
            setChannelData({chnId, status, name});
        }
    }

    const registerChannelExecute = async () => {
        let name = channelNameEl.current.value;
        if(!name){ return false; }

        let tx = await registerChannel(name);
        if(tx){
            channelNameEl.current.value = '';
            await getMyChannel()
        }
    }

    const changeChannelNameExecute = async () => {
        let name = channelNameEl.current.value;
        if(!name){ return false; }

        let tx = await changeChannelName(name);
        if(tx){
            channelNameEl.current.value = '';
            await getMyChannel()
        }
    }

    useEffect(() => {

        console.log('useEffect~')
        getMyChannel();  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress])

    return (
    <>  
        <Card title="My Sales Channel" reload={getMyChannel}>
            {channelData?.chnId && (
            <>
                <p className="card-text mb-1">Channel Id: {channelData.chnId.toString()}</p>
                <p className="card-text mb-1">Channel Name: {channelData.name}</p>
                <p className="card-text">Channel Status: {statusEl(channelData.status)}</p>
            </>
            )}
            {(channelData?.status || !channelData.chnId) && (
                <div className="input-group mb-1 mt-4">
                    <input type="text" className="form-control" placeholder='Channel Name...' ref={channelNameEl}/>
                    {!channelData.chnId && (
                        <WriteBtn action={registerChannelExecute} isLoading={isLoading || isPending}>Register My Channel</WriteBtn>
                    )}
                    {channelData?.status && (
                        <WriteBtn action={changeChannelNameExecute} isLoading={isLoading || isPending}>Change Channel Name</WriteBtn>
                    )}
                </div>
            )}

        </Card>

    </>
    )

}