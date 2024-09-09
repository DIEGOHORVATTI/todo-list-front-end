'use client'

import Stack from '@mui/material/Stack'

import { alpha, ButtonBase, styled } from '@mui/material'

import { Iconify } from '@/components/iconify'

import { priorityValues, PriorityValues } from '@/shared/priorityValues'

export const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: '100%',
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}))

type Props = {
  priority: PriorityValues
  onChange?: (value: PriorityValues) => void
}

export const PriorityStatus = ({ priority, onChange }: Props) => {
  return (
    <Stack direction="column" alignItems="left" spacing={1}>
      <StyledLabel>Prioridade</StyledLabel>

      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {priorityValues.map((option) => (
          <ButtonBase
            key={option}
            onClick={() => onChange?.(option)}
            sx={{
              p: 1,
              fontSize: 12,
              borderRadius: 1,
              lineHeight: '20px',
              textTransform: 'capitalize',
              fontWeight: 'fontWeightBold',
              boxShadow: (theme) => `inset 0 0 0 1px ${alpha(theme.palette.grey[500], 0.24)}`,
              ...(option === priority && {
                boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.text.primary}`,
              }),
            }}
          >
            <Iconify
              icon="line-md:circle-twotone"
              sx={{
                mr: 0.5,
                ...(option === 'baixa' && {
                  color: 'info.main',
                }),
                ...(option === 'média' && {
                  color: 'warning.main',
                }),
                ...(option === 'alta' && {
                  color: 'error.main',
                }),
              }}
            />

            {option}
          </ButtonBase>
        ))}
      </Stack>
    </Stack>
  )
}
