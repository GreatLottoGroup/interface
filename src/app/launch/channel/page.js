'use client';


import MyChannel from './components/myChannel'
import ChannelList from './components/channelList'

export default function SalesChannel() {

    return (

    <>  

        <div className='mb-3 row'>
            <div className='col'>
                <MyChannel />
            </div>
            <div className='col'>

            </div>
        </div>

        <div className='mb-3 row'>
            <div className='col'>
                <ChannelList hasActions={false} />
            </div>
        </div>

    </>

    )
}