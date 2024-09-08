import { useFormContext, Controller } from 'react-hook-form'

import { AutocompleteProps, AutocompleteValue } from '@mui/material/Autocomplete'

import {
  TextField,
  Autocomplete,
  InputAdornment,
  OutlinedTextFieldProps,
  Chip,
} from '@mui/material'
import { useRequest, UseRequestProps } from '../../hooks/use-request'
import Image from '../image'
import { Iconify } from '../iconify'

type Option = {
  label: string
  value: number | string
  icon?: string
  img?: string
}

type Props<Value, Multiple extends boolean | undefined> = Omit<
  AutocompleteProps<Option, Multiple, true, false>,
  'options'
> &
  Pick<OutlinedTextFieldProps, 'size'> & {
    name: string
    label?: string
    placeholder?: string
    required?: boolean
    getRequestUrl?: UseRequestProps & {
      key?: string
      options?: (params: Value) => Array<Option>
    }
    loading?: boolean
    options?: Array<Option>
    helperText?: React.ReactNode
  }

export const RHFAutocomplete = <Value, Multiple extends boolean | undefined = false>({
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
}: Omit<Props<Value, Multiple>, 'renderInput'>) => {
  const { control } = useFormContext()

  const { data, isLoading } = useRequest<Value>({
    url: getRequestUrl?.url || '/set-a-url',
    method: getRequestUrl?.method || 'GET',
    stopRequest: Boolean(!getRequestUrl) || getRequestUrl?.stopRequest,
  })

  const optionsMerge =
    (options ??
      (getRequestUrl?.key
        ? // @ts-ignore
          getRequestUrl?.options?.(data?.[getRequestUrl?.key])
        : getRequestUrl?.options?.(data ?? ([] as Value)))) ||
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
                  ) as AutocompleteValue<Option, Multiple, true, false>,
                  getOptionLabel: (option: Option) =>
                    option?.label ||
                    optionsMerge.find((items) => String(items.value) === String(option))?.label ||
                    '',
                }
              : {
                  value: restField.value || null,
                  getOptionKey: (option: Option) => option.value,
                  getOptionLabel: (option: Option) =>
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
                      (value: Option | string) => String(value) === String(item.value)
                    )
                  : String(item.value) !== String(restField.value))
            )}
            loading={loadingOptions}
            onChange={(_, options) => {
              if (Array.isArray(options)) {
                return onChange((options as Array<Option>)?.map((item) => item.value || item))
              }

              return onChange((options as Option)?.value)
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
