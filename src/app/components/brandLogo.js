'use client';
import {Avatar} from '@mui/material'

export default function BrandLogo({sx}) {
    console.log('sx: ', sx);
    return (
  
        <Avatar src="/logo@2x.png" variant="rounded" sx={{ width: 35, height: 35, ...sx }}/>
    
  
    )
  }
  