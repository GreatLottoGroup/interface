'use client';

import { useState } from 'react'
import WriteBtn from '@/launch/components/writeBtn'

export default function Card({children, title, reload}) {

    const [isReloading, setIsReloading] = useState(false);

    const reloadExecute = async () => {
        setIsReloading(true);
        await reload();
        setIsReloading(false);
    }
    

  return (
    <>

        <div className="card" >
            <div className="card-body position-relative">
                {reload && (
                    <WriteBtn action={reloadExecute} isLoading={isReloading} className="btn-sm btn-light position-absolute end-0 me-3"> ReLoad </WriteBtn>
                )}
                <h5 className="card-title">{title}</h5>
                {children}
            </div>
        </div>

    </>

  )
}

