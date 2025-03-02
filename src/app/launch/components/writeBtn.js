'use client';

import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material';

export default function WriteBtn({children, action, isLoading, variant, color, size, className, hasLoadingProgress = true, sx}) {
    const [disabled, setDisabled] = useState(false);

    const setPause = () => {
        setDisabled(true);
        setTimeout(()=>{
            setDisabled(false);
        }, 3000)
    }

    return (
        <Button
            variant= { variant || "contained" }
            color= { color || 'primary' }
            size={ size || 'medium' }
            disabled={isLoading || disabled}
            onClick={() => {
                setPause();
                action();
            }}
            className={className}
            sx={{
                position: 'relative',
                ...sx
            }}
        >
            {children}
            {isLoading ? ' ...' : ''}
            {isLoading && hasLoadingProgress && (
                <CircularProgress
                    size={20}
                    color={ color || 'primary' }
                    sx={{
                        position: 'absolute',
                        right: 8
                    }}
                />
            )}
        </Button>
    )
}

