import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Theme, SxProps } from '@mui/material/styles'
import { Link } from '@mui/material'

import { fileData, fileFormat, fileThumb } from './utils'
import DownloadButton from './download-button'

import type { ExtendFile } from '@/components/file-thumbnail/types'

type FileIconProps = {
  file: ExtendFile
  imageView?: boolean
  onDownload?: VoidFunction
  sx?: SxProps<Theme>
  imgSx?: SxProps<Theme>
}

export default function FileThumbnail({ file, imageView, onDownload, sx, imgSx }: FileIconProps) {
  const { path = '', preview = '' } = fileData(file)

  const format = fileFormat(path || preview)

  const renderContent =
    format === 'image' && imageView ? (
      <Box
        component="img"
        src={preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'cover',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
    )

  return (
    <Link href={file.preview} target="_blank">
      <Stack
        flexShrink={0}
        component="span"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 'fit-content',
          height: 'inherit',
        }}
      >
        {renderContent}
        {onDownload && <DownloadButton onDownload={onDownload} />}
      </Stack>
    </Link>
  )
}
