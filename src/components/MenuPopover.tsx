import { useState } from 'react'

import { IconButton, Popover, PopoverProps, menuItemClasses, PopoverOrigin } from '@mui/material'

import { Iconify } from '@/components/iconify'

import { getPosition } from './custom-popover/utils'
import { StyledArrow } from './custom-popover/styles'

type Arrow =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'right-top'
  | 'right-center'
  | 'right-bottom'

type Props = Partial<PopoverProps> & {
  arrow?: Arrow
  renderContent?: (onClose: () => void) => JSX.Element
}

export const MenuPopover = ({
  children,
  arrow = 'top-right',
  renderContent,
  sx,
  ...other
}: Props) => {
  const { style, anchorOrigin, transformOrigin } = getPosition(arrow)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <>
      {!other.open && (
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Iconify icon="mdi:dots-vertical" />
        </IconButton>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin as PopoverOrigin}
        transformOrigin={transformOrigin as PopoverOrigin}
        sx={{ zIndex: 1 }}
        slotProps={{
          paper: {
            sx: {
              width: 150,
              padding: '1px 0px',
              overflow: 'inherit',
              ...style,
              [`& .${menuItemClasses.root}`]: {
                '& svg': {
                  mr: 2,
                  flexShrink: 0,
                },
              },
              ...sx,
            },
          },
        }}
        {...other}
      >
        {!arrow && <StyledArrow arrow={arrow} />}

        {renderContent && renderContent(handleClose)}

        {children}
      </Popover>
    </>
  )
}
