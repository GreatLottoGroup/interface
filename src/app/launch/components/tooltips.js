'use client';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './tooltips.css'

export default function Tooltips({children, title, placement}) {

    placement = placement || 'right'


  return (

    <OverlayTrigger placement={placement} overlay={
        <Tooltip className='gray-tooltip'>
            {title}
        </Tooltip>
    }>
        {children}
    </OverlayTrigger>

  )
}

