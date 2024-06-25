'use client';

import { useState } from 'react'
import Toast from 'react-bootstrap/Toast';

export function useGlobalToast(){
    const [globalToast, setGlobalToast] = useState({}); 

    return {
        globalToast,
        setGlobalToast
    }
}

export function GlobalToast({globalToast, setGlobalToast}) {

    /**
     {
        status: 'success', // 'error' 'info'
        title: 'xxx',
        subTitle: 'xxx'
        message: 'xxx'
     }
    */

    const getToastStatus = (status) => {
        let s = {}
        if(status == 'success'){
            s.color = 'text-success';
            s.icon = 'bi-check-circle';
        }else if(status == 'error'){
            s.color = 'text-danger';
            s.icon = 'bi-x-circle';
        }else if(status == 'pending'){
            s.color = 'text-warning';
            s.icon = 'bi-cloud-upload';
        }else if(status == 'info'){
            s.color = 'text-primary';
            s.icon = 'bi-exclamation-circle';
        }
        return s;
    }

  return (
    <>        
        <div className="position-fixed bottom-0 end-0 p-3">

            <Toast onClose={()=>setGlobalToast({})} show={!!globalToast?.message} delay={globalToast?.status == 'error' ? 15000 : 5000} autohide={globalToast?.status != 'pending'}>
                <Toast.Header className={getToastStatus(globalToast?.status)?.color}>
                    <i className={"bi me-2 " + getToastStatus(globalToast?.status)?.icon}></i>
                    <strong className="me-auto text-capitalize">{globalToast?.title ?? globalToast?.status ?? 'Info'}</strong>
                    <small className='text-capitalize'>{globalToast?.subTitle}</small>
                </Toast.Header>
                <Toast.Body>
                    {globalToast?.status == 'pending' && (
                        <div className="spinner-border spinner-border-sm me-2 "></div>
                    )}
                    <span className='text-capitalize'>{globalToast?.message}</span>
                </Toast.Body>
            </Toast>

        </div>

    </>

  )
}

