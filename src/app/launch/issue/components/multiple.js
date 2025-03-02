'use client';

import { Typography, ButtonGroup, Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export function Periods({periods, setPeriods}) {
    const handleChange = (e) => {
        let p = Math.trunc(e.target.value * 1);
        if (p >= 1 && p <= 100) {
            setPeriods(p);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Periods
            </Typography>
            <ButtonGroup variant="outlined" color="inherit" size="small" sx={{ display: 'flex' }}>
                <Button 
                    onClick={() => { if (periods > 1) setPeriods(periods - 1) }}
                    sx={{ flex: '0 0 auto' }}
                >
                    <RemoveIcon fontSize="small" />
                </Button>
                <TextField
                    type="number"
                    value={periods}
                    onChange={handleChange}
                    size="small"
                    slotProps={{
                        input: {
                            min: 1,
                            max: 100,
                            step: 1,
                            style: { textAlign: 'center' }
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 0
                        }
                    }}
                />
                <Button 
                    onClick={() => { if (periods < 100) setPeriods(periods + 1) }}
                    sx={{ flex: '0 0 auto' }}
                >
                    <AddIcon fontSize="small" />
                </Button>
            </ButtonGroup>
        </Box>
    );
}

export function Multiple({multiple, setMultiple}) {
    const handleChange = (e) => {
        let p = Math.trunc(e.target.value * 1);
        if (p >= 1 && p <= 100) {
            setMultiple(p);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Multiple
            </Typography>
            <ButtonGroup variant="outlined" color="inherit" size="small" sx={{ display: 'flex' }}>
                <Button 
                    onClick={() => { if (multiple > 1) setMultiple(multiple - 1) }}
                    sx={{ flex: '0 0 auto' }}
                >
                    <RemoveIcon fontSize="small" />
                </Button>
                <TextField
                    type="number"
                    value={multiple}
                    onChange={handleChange}
                    size="small"
                    slotProps={{
                        input: {
                            min: 1,
                            max: 100,
                            step: 1,
                            style: { textAlign: 'center' }
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 0
                        }
                    }}
                />
                <Button 
                    onClick={() => { if (multiple < 100) setMultiple(multiple + 1) }}
                    sx={{ flex: '0 0 auto' }}
                >
                    <AddIcon fontSize="small" />
                </Button>
            </ButtonGroup>
        </Box>
    );
}