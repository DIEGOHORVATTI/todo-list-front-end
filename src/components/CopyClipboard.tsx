'use client'

import { enqueueSnackbar } from 'notistack'

import { useCopyToClipboard } from 'react-use'

import {
  Tooltip,
  TextField,
  InputAdornment,
  TextFieldProps,
  Paper,
  useTheme,
  Stack,
  IconButton,
} from '@mui/material'

import { alpha } from '@mui/system'
import { Iconify } from './iconify'

export type CopyClipboardProps = TextFieldProps & {
  value: string | number
  icon?: string
  variantField?: 'input' | 'button'
}

export const CopyClipboard = ({
  value,
  size = 'small',
  icon,
  variantField = 'input',
  ...other
}: CopyClipboardProps) => {
  const theme = useTheme()

  const [state, copyToClipboard] = useCopyToClipboard()

  const onCopy = ({ value }: Pick<CopyClipboardProps, 'value'>) => {
    copyToClipboard(String(value))

    state.error
      ? enqueueSnackbar(`Erro: ${state.error.message}`, {
          variant: 'error',
          preventDuplicate: true,
        })
      : enqueueSnackbar('Copiado com sucesso!', {
          variant: 'success',
          preventDuplicate: true,
        })
  }

  if (variantField === 'button') {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 1,
          width: 'max-content',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" p={1}>
          <Tooltip title="Copiar">
            <IconButton onClick={() => onCopy({ value })} size={size}>
              <Iconify icon={icon ?? 'eva:copy-fill'} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    )
  }

  return (
    <TextField
      fullWidth
      size={size}
      value={value}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Copy">
              <IconButton onClick={() => onCopy({ value })} size={size}>
                <Iconify icon="eva:copy-fill" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      {...other}
    />
  )
}
