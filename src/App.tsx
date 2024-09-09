'use client'

import 'react-lazy-load-image-component/src/effects/blur.css'

import ThemeProvider, { SettingsValueProps } from './theme'

import ProgressBar from './components/progress-bar'
import { MotionLazy } from './components/animate/motion-lazy'
import SnackbarProvider from './contexts/snackbar/snackbar-provider'

import { KanbanView } from '@/sections/kanban/kanban-view'

import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { IconButton, Stack } from '@mui/material'
import { useState } from 'react'
import { Iconify } from './components'

const settingsDefault: SettingsValueProps = {
  themeMode: 'dark',
  themeDirection: 'ltr',
  themeContrast: 'default',
  themeLayout: 'vertical',
  themeColorPresets: 'default',
  themeStretch: false,
}

const settingsFromLocalStorage: SettingsValueProps = (() => {
  const storedValue = localStorage.getItem('@taskList:settings')

  return JSON.parse(storedValue || JSON.stringify(settingsDefault))
})()

export const App = () => {
  const [settings, setSettings] = useState<SettingsValueProps>(settingsFromLocalStorage)

  const hadleSettings = (newSettings: SettingsValueProps) => {
    setSettings(newSettings)
    localStorage.setItem('@taskList:settings', JSON.stringify(newSettings))
  }

  const isDark = settings.themeMode === 'dark'

  const themeToggleButton = (
    <IconButton
      sx={{
        position: 'fixed',
        top: '50%',
        right: 16,
        zIndex: 10,
        backgroundColor: 'background.paper',
      }}
      onClick={() =>
        hadleSettings({
          ...settings,
          themeMode: isDark ? 'light' : 'dark',
        })
      }
    >
      {!isDark ? <Iconify icon="bi:moon-stars-fill" /> : <Iconify icon="bi:sun-fill" />}
    </IconButton>
  )
  return (
    <ThemeProvider settings={settings}>
      <MotionLazy>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MuiLocalizationProvider dateAdapter={AdapterDateFns}>
              <ProgressBar />

              {themeToggleButton}

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
