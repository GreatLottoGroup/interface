'use client';

import { useState } from 'react'
import WriteBtn from '@/launch/components/writeBtn'

export default function Card({children, title, subTitle, reload, className}) {

    const [isReloading, setIsReloading] = useState(false);

    const reloadExecute = async () => {
        setIsReloading(true);
        await reload();
        setIsReloading(false);
    }

  return (
    <>

        <div className={"card " + className}>
            <div className="card-body position-relative">
                {reload && (
                    <WriteBtn action={reloadExecute} isLoading={isReloading} className="btn-sm btn-light position-absolute end-0 me-3"> ReLoad </WriteBtn>
                )}
                <h5 className="card-title">{title}
                    {subTitle && (
                        <span className='badge text-bg-light ms-3 px-2'>{subTitle}</span>                    
                    )}
                </h5>
                {isReloading ? (
                    <p className='card-text text-center my-2'>
                        <span className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </span>          
                    </p>) : children}
            </div>
        </div>

    </>

  )
}

