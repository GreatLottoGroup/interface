'use client';

import { useState, useEffect, useRef } from 'react'
import { usePublicClient, useAccount } from 'wagmi'

import useSalesChannel from '@/launch/hooks/contracts/SalesChannel'

export default function MyChannel() {

    const publicClient = usePublicClient()
    const { address: accountAddress } = useAccount()

    const [channelData, setChannelData] = useState({})
    const channelNameEl = useRef(null)

    const { getChannelByAddr, statusEl, registerChannel, changeChannelName, error, setError, isLoading, isSuccess } = useSalesChannel()


    const getMyChannel = async () => {
        let [status, chnId, name] = await getChannelByAddr();
        console.log(status, chnId, name)
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
    }, [publicClient, accountAddress])

    return (
    <>  
        <div className="card" >
            <div className="card-body">
                <h5 className="card-title">My Sales Channel:</h5>
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
                            <button type="button" disabled={!!isLoading} className='btn btn-primary'  onClick={()=>{registerChannelExecute()}}> Register My Channel {isLoading ? '...' : ''}</button>
                        )}
                        {channelData?.status && (
                            <button type="button" disabled={!!isLoading} className='btn btn-primary'  onClick={()=>{changeChannelNameExecute()}}> Change Channel Name {isLoading ? '...' : ''}</button>
                        )}
                    </div>
                )}
            </div>
        </div>

    </>
    )

}