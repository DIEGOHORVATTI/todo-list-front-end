import { Link, LinkProps } from '@mui/material'
import { forwardRef } from 'react'

const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(({ ...other }, ref) => (
  <Link ref={ref} {...other} />
))

export default RouterLink
