import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase'

export default function KanbanInputName({ sx, ...other }: InputBaseProps) {
  return (
    <InputBase
      sx={{
        [`&.${inputBaseClasses.root}`]: {
          borderRadius: 1,
          typography: 'h6',
          borderWidth: 0.5,
          borderStyle: 'solid',
          borderColor: 'transparent',
          transition: (theme) => theme.transitions.create(['padding-left', 'border-color']),
          [`&.${inputBaseClasses.focused}`]: {
            borderColor: 'text.primary',
          },
        },
        [`& .${inputBaseClasses.input}`]: {
          typography: 'h6',
        },
        ...sx,
      }}
      {...other}
    />
  )
}
