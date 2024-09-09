import { DropzoneOptions } from 'react-dropzone'

import { Theme, SxProps } from '@mui/material/styles'

export type CustomFile = File & {
  path?: string
  preview?: string
  lastModifiedDate?: Date
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean
  sx?: SxProps<Theme>
  placeholder?: React.ReactNode
  helperText?: React.ReactNode
  disableMultiple?: boolean
  file?: CustomFile | string
  onDelete?: VoidFunction
  files?: Array<File & { preview: string }>
  onUpload?: VoidFunction
  onRemove?: (file: CustomFile) => void
  onRemoveAll?: VoidFunction
  onChange: (...event: any[]) => void
}
