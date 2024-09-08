import 'react-lazy-load-image-component/src/effects/blur.css'

import { useEffect } from 'react'

import ThemeProvider from './theme'

import ProgressBar from './components/progress-bar'
import { MotionLazy } from './components/animate/motion-lazy'
import SnackbarProvider from './contexts/snackbar/snackbar-provider'

import { KanbanView } from '@/sections/kanban/kanban-view'

import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { Stack } from '@mui/material'

import { endpoints } from './constants/config'

import { SettingsButton } from './components/settings'
import { useRequest } from './hooks/use-request'

import { User } from './types/user'

export const App = () => {
  const { data: user } = useRequest<User>({
    url: endpoints.user.getUser,
  })

  const isPermissionAdmin = user?.permissions === 'admin'

  useEffect(() => {
    if (user) {
      localStorage.setItem('userId', user._id)
    }
  }, [user])

  return (
    <ThemeProvider
      settings={{
        themeMode: 'light',
        themeDirection: 'ltr',
        themeContrast: 'default',
        themeLayout: 'vertical',
        themeColorPresets: 'default',
        themeStretch: false,
      }}
    >
      <MotionLazy>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MuiLocalizationProvider dateAdapter={AdapterDateFns}>
              <ProgressBar />
              {isPermissionAdmin && <SettingsButton />}

              <Stack direction="column" spacing={2}>
                <KanbanView />
              </Stack>
            </MuiLocalizationProvider>
          </LocalizationProvider>
        </SnackbarProvider>
      </MotionLazy>
    </ThemeProvider>
  )
}
