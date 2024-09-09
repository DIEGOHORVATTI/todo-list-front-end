import { m } from 'framer-motion'

import Box from '@mui/material/Box'
import { varContainer } from './variants/container'

export default function MotionContainer({ animate, action = false, children, ...other }) {
  if (action) {
    return (
      <Box
        component={m.div}
        initial={false}
        animate={animate ? 'animate' : 'exit'}
        variants={varContainer()}
        {...other}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  )
}
