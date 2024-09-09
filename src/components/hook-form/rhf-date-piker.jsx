import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { Controller, useFormContext } from 'react-hook-form'

export const RHFDatePiker = ({
  name,
  label,
  error,
  helperText,
  ...rest
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <DatePicker
          value={value ? new Date(value) : new Date()}
          onChange={onChange}
          label={label || name}
          slotProps={{
            actionBar: {
              actions: ['today', 'accept'],
            },
            textField: {
              error: error,
              helperText: helperText,
            },
          }}
          {...rest}
        />
      )}
    />
  )
}
