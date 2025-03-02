'use client';

import { useState } from 'react'
import WriteBtn from '@/launch/components/writeBtn'
import { Card as MuiCard, CardContent, Typography, Box, CircularProgress } from '@mui/material';

export default function Card({children, title, subTitle, reload, className}) {

    const [isReloading, setIsReloading] = useState(false);

    const reloadExecute = async () => {
        setIsReloading(true);
        await reload();
        setIsReloading(false);
    }

  return (
    <MuiCard className={className} variant="outlined">
      <CardContent sx={{ position: 'relative' }}>
        {reload && (
          <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
            <WriteBtn 
              action={reloadExecute} 
              isLoading={isReloading} 
              variant="outlined" 
              color="inherit" 
              size="small"
              hasLoadingProgress={false}
            >
              ReLoad
            </WriteBtn>
          </Box>
        )}
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {title}
          {subTitle && (
            <Box component="span" sx={{
              ml: 2,
              px: 1,
              py: 0.5,
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontSize: '0.8em'
            }}>
              {subTitle}
            </Box>
          )}
        </Typography>
        {isReloading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2
          }}>
            <CircularProgress size={24}/>
          </Box>
        ) : children}
      </CardContent>
    </MuiCard>
  )
}

