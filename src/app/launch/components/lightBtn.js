import { Button } from '@mui/material';
import { styled } from '@mui/system';

const LightBtn = styled(Button)({
  backgroundColor: '#f8f9fa',
  color: '#000',
  borderColor: '#f8f9fa',
  padding: '0.375rem 0.75rem',
  lineHeight: '1.5',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: '#d3d4d5',
    borderColor: '#c6c7c8',
  },
});

export { LightBtn };


