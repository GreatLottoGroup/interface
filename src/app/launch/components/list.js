'use client';

import { Stack, CircularProgress, Typography } from '@mui/material';

export default function List({children, list, isLoading}) {
  return (
    <Stack alignItems={isLoading || list.length == 0 ? "center" : "flex-start"} spacing={2}>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        list.length > 0 ? children : (
          <Typography variant="subtitle1" color="text.secondary">
            No Data
          </Typography>
        )
      )}
    </Stack>
  )
}

