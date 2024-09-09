import { Icon, IconifyIcon } from '@iconify/react'

import { Box, BoxProps } from '@mui/material'

interface Props extends BoxProps {
  icon?: IconifyIcon | string
  size?: number
  name?: string
}

export const Iconify = ({ icon, size = 2, sx, name, ...other }: Props) => {
  return <Box component={Icon} icon={icon} sx={{ ...sx, fontSize: size * 10 }} {...other} />
}
