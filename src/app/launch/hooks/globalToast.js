'use client';

import { useState } from 'react'
import { Snackbar, Alert, AlertTitle, CircularProgress } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';

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
            s.color = 'success';
            s.icon = null;
        }else if(status == 'error'){
            s.color = 'error';
            s.icon = <CancelOutlinedIcon fontSize="inherit"/>;
        }else if(status == 'pending'){
            s.color = 'warning';
            s.icon = <BackupOutlinedIcon fontSize="inherit"/>;
        }else if(status == 'info'){
            s.color = 'info';
            s.icon = null;
        }
        return s;
    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setGlobalToast({});
      };

    const toastStatus = getToastStatus(globalToast?.status);
    

    return (
        <Snackbar
            open={!!globalToast?.message}
            onClose={globalToast?.status !== 'pending' ? handleClose : null}
            autoHideDuration={globalToast?.status === 'error' ? 15000 : 5000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ width: '400px', zIndex: 99999, left: 'auto' }}
        >
            {globalToast?.message && (
                <Alert
                    onClose={handleClose}
                    severity={toastStatus.color}
                    icon={toastStatus.icon || ''}
                    sx={{ width: '100%', backgroundColor: '#fff' }}
                    variant="outlined" 
                >
                    <AlertTitle sx={{ textTransform: 'capitalize', mt: 0 }}>
                        {globalToast?.title ?? globalToast?.status ?? 'Info'}
                        <span style={{ fontSize: '0.8rem', opacity: 0.8, marginLeft: '10px' }}>
                            {globalToast?.subTitle}
                        </span>
                    </AlertTitle>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {globalToast?.status === 'pending' && (
                            <CircularProgress size={20} color="warning"/>
                        )}
                        <span style={{ textTransform: 'capitalize' }}>{globalToast?.message}</span>
                    </div>
                </Alert>
            )}
        </Snackbar>
    )
}

