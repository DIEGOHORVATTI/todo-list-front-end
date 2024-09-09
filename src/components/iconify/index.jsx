import { Icon } from '@iconify/react'

import { Box } from '@mui/material'


export const Iconify = ({ icon, size = 2, sx, name, ...other }) => {
  return <Box component={Icon} icon={icon} sx={{ ...sx, fontSize: size * 10 }} {...other} />
}
