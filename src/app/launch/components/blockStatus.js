'use client';

import { Chip } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

export const BlockStatus = ({status, hasDetail, toggleDetailShow}) => {
    let props = {};
    switch (status) {
        case 'drawn':
            props = {
                label: 'Drawn',
                color: 'success',
                variant: 'filled'
            };
            break;
        case 'rolled':
            props = {
                label: 'Rolled',
                color: 'success',
                variant: 'outlined'
            };
            break;
        case 'waitingDraw':
            props = {
                label: 'Waiting for Draw',
                color: 'primary',
                variant: 'outlined'
            };
            break;
        case 'drawSoon':
            props = {
                label: 'Draw Soon',
                color: 'primary',
                variant: 'filled'
            };
            break;
        case 'waitingRollup':
            props = {
                label: 'Waiting for Rollup',
                color: 'warning',
                variant: 'outlined'
            };
            break;
        default:
            return null;
    }
    
    return (
        <Chip label={props.label} size="small" {...props} deleteIcon={hasDetail ? <ArrowCircleRightOutlinedIcon /> : null} onClick={toggleDetailShow} onDelete={toggleDetailShow} sx={{ fontWeight: 'bold' }}/>
    );
};

export default BlockStatus;