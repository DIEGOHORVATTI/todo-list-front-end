import { m, AnimatePresence } from 'framer-motion'

import { alpha } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'

import { Iconify } from '@/components/iconify'
import { varFade } from '../animate'
import FileThumbnail, { fileData } from '../file-thumbnail'
import { UploadProps } from './types'
import { Tooltip } from '@mui/material'

export default function MultiFilePreview({ files, onRemove, sx }: Omit<UploadProps, 'onChange'>) {
  return (
    <AnimatePresence initial={false}>
      {files?.map((file) => {
        const { key, name } = fileData(file)

        return (
          <Tooltip title={name} arrow placement="bottom" key={key}>
            <Stack
              key={key}
              component={m.div}
              {...varFade().inUp}
              alignItems="center"
              display="inline-flex"
              justifyContent="center"
              sx={{
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                overflow: 'hidden',
                position: 'relative',
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                ...sx,
              }}
            >
              <FileThumbnail
                imageView
                file={file}
                sx={{ position: 'absolute' }}
                imgSx={{ position: 'absolute' }}
              />

              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(file)}
                  sx={{
                    p: 0.5,
                    top: 4,
                    right: 4,
                    position: 'absolute',
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    },
                  }}
                >
                  <Iconify icon="mingcute:close-line" width={14} />
                </IconButton>
              )}
            </Stack>
          </Tooltip>
        )
      })}
    </AnimatePresence>
  )
}
