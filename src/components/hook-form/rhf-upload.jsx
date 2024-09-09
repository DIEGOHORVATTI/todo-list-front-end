import { useFormContext, Controller } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'

import { Upload } from '../upload'

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Upload
          multiple={multiple}
          accept={{ '/*': [] }}
          files={value}
          onChange={onChange}
          error={!!error}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />
      )}
    />
  )
}
