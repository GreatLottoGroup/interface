'use client';

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import Card from '@/launch/components/card'
import useSalesChannel from '@/launch/hooks/contracts/SalesChannel'
import WriteBtn from '@/launch/components/writeBtn'
import { Stack, TextField, Typography, ButtonGroup } from '@mui/material'

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
                <Stack spacing={1} sx={{mb: 2}}>
                    <Typography variant="subtitle1">Channel Id: {channelData.chnId.toString()}</Typography>
                    <Typography variant="subtitle1">Channel Name: {channelData.name}</Typography>
                    <Typography variant="subtitle1">Channel Status: {statusEl(channelData.status)}</Typography>
                </Stack>
            )}
            {(channelData?.status || !channelData.chnId) && (
                <ButtonGroup fullWidth
                    sx={{
                        '& .MuiButtonGroup-grouped': {
                            minWidth: '160px !important',
                            width: 'auto',
                            whiteSpace: 'nowrap'
                        },
                        '& .MuiOutlinedInput-root': {
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0
                        }
                    }}
                >
                    <TextField
                        size="small"
                        label="Channel Name"
                        inputRef={channelNameEl}
                        fullWidth
                    />
                    {!channelData.chnId && (
                        <WriteBtn action={registerChannelExecute} isLoading={isLoading || isPending} variant="outlined" size="small">Register My Channel</WriteBtn>
                    )}
                    {channelData?.status && (
                        <WriteBtn action={changeChannelNameExecute} isLoading={isLoading || isPending} variant="outlined" size="small">Change Channel Name</WriteBtn>
                    )}
                </ButtonGroup>
            )}

        </Card>

    </>
    )

}