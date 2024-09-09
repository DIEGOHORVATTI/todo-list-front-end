import { useFormContext, Controller } from 'react-hook-form'

import {
  TextField,
  Autocomplete,
  InputAdornment,
  Chip,
} from '@mui/material'
import { useRequestSWR } from '../../hooks/use-request'
import Image from '../image'
import { Iconify } from '../iconify'

export const RHFAutocomplete = ({
  name,
  size = 'medium',
  label = '',
  placeholder,
  helperText,
  options,
  loading,
  required,
  getRequestUrl,
  ...other
}) => {
  const { control } = useFormContext()

  const { data, isLoading } = useRequestSWR({
    url: getRequestUrl?.url || '/set-a-url',
    method: getRequestUrl?.method || 'GET',
    stopRequest: Boolean(!getRequestUrl) || getRequestUrl?.stopRequest,
  })

  const optionsMerge =
    (options ??
      (getRequestUrl?.key
        ? // @ts-ignore
        getRequestUrl?.options?.(data?.[getRequestUrl?.key])
        : getRequestUrl?.options?.(data ?? []))) ||
    []

  const loadingOptions = loading || isLoading

  const isMultiple = other.multiple

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render={({ field: { ref, onChange, ...restField }, fieldState: { error } }) => {
        return (
          <Autocomplete
            {...restField}
            {...other}
            {...(isMultiple
              ? {
                value: optionsMerge.filter((item) =>
                  restField.value?.includes(item.value)
                ),
                getOptionLabel: (option) =>
                  option?.label ||
                  optionsMerge.find((items) => String(items.value) === String(option))?.label ||
                  '',
              }
              : {
                value: restField.value || null,
                getOptionKey: (option) => option.value,
                getOptionLabel: (option) =>
                  option?.label ||
                  optionsMerge.find((items) => items.value === restField.value)?.label ||
                  '',
              })}
            autoComplete
            filterSelectedOptions
            disableClearable
            size={size}
            options={optionsMerge.filter(
              (item) =>
                !restField.value ||
                (isMultiple
                  ? !restField.value.find(
                    (value) => String(value) === String(item.value)
                  )
                  : String(item.value) !== String(restField.value))
            )}
            loading={loadingOptions}
            onChange={(_, options) => {
              if (Array.isArray(options)) {
                return onChange((options)?.map((item) => item.value || item))
              }

              return onChange((options)?.value)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={`${label}${required ? '*' : ''}`}
                placeholder={`${placeholder || label}${required ? '*' : ''}`}
                aria-required={required}
                error={!!error}
                helperText={error ? error?.message : helperText}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '0px 10px !important',
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  ...(loadingOptions && {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon="line-md:downloading-loop" size={2.5} />
                      </InputAdornment>
                    ),
                  }),
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.label}
                  color="default"
                  {...getTagProps({ index })}
                  sx={{
                    borderColor: 'background.neutral',
                    backgroundColor: 'background.neutral',
                    borderRadius: 1,
                    alignItems: 'center',
                  }}
                  deleteIcon={<Iconify icon="eva:close-fill" />}
                  key={Math.random()}
                />
              ))
            }
            filterOptions={(options, params) => {
              const filtered = options.filter((option) =>
                option.label.toLowerCase().includes(params.inputValue.toLowerCase())
              )

              if (params.inputValue !== '') {
                filtered.push({ label: params.inputValue, value: params.inputValue })
              }

              return filtered
            }}
            renderOption={(props, option) => (
              <li {...props} key={props.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                  }}
                >
                  {option?.img && (
                    <Image
                      src={option.img}
                      alt={label}
                      width={40}
                      height={40}
                      sx={{ borderRadius: '50%' }}
                    />
                  )}

                  {option?.icon && <Iconify icon={option.icon} size={2} />}

                  <span>{option.label}</span>
                </div>
              </li>
            )}
            {...other}
          />
        )
      }}
    />
  )
}
