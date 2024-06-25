'use client';

import { useState } from 'react'

export default function WriteBtn({children, action, isLoading, className}) {

    const [disabled, setDisabled] = useState(false);

    const setPause = () => {
        setDisabled(true);
        setTimeout(()=>{
            setDisabled(false);
        }, 3000)
    }

  return (
    <button type="button" disabled={isLoading || disabled} className={'btn btn-primary ' + className} onClick={()=>{
        setPause();
        action();
    }}> 
        {children}
        {isLoading ? ' ...' : ''}
    </button>
  )
}

