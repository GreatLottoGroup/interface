'use client';

import { useAccount } from 'wagmi'
import { isOwner } from '@/launch/hooks/globalVars'

export default function ManagementTemplate({ children }) {

    const { address: accountAddress } = useAccount();

    return (
    <>
    {isOwner(accountAddress) ? (children) : (
        <div className='border px-3 py-3 mb-3 row'>
            <div className='col'>
                <h3>Please use the administrator account</h3>
            </div>
        </div>
    )}
    </>

  )
}

