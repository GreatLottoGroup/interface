'use client';

import { Tooltip } from '@mui/material';

export default function Tooltips({children, title, placement}) {
    placement = placement || 'right'

    return (
        <Tooltip 
            title={title}
            placement={placement}
            arrow
            slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                },
              }}
        >
            {children}
        </Tooltip>
    )
}

