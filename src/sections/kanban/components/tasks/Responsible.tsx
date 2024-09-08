import { Chip, Stack, Tooltip, IconButton } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'

import { useBoolean } from '@/hooks/use-boolean'
import { useRequest } from '@/hooks/use-request'

import { Iconify } from '@/components/iconify'
import { KanbanContactsDialog } from './kanban-contacts-dialog'

import { endpoints } from '@/constants/config'

import { User } from '@/types/user'

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}))

type Props = {
  assignee:
    | {
        userId: string
      }[]
    | undefined
  onAppend: (value: any) => void
  onRemove: (index: any) => void
}

export const Responsible = ({ assignee, onAppend, onRemove }: Props) => {
  const viewContacts = useBoolean()

  const { data: users } = useRequest<Array<User>>({
    url: endpoints.user.getAllUsers,
  })

  return (
    <Stack direction="column" alignItems="left" spacing={1}>
      <StyledLabel>Responsáveis</StyledLabel>

      <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
        {assignee?.map((task, index) => (
          <Chip
            key={index}
            label={users?.find((user) => user._id === task.userId)?.name}
            variant="soft"
            onDelete={() => onRemove(task.userId)}
            sx={{
              color: 'text.primary',
              borderRadius: 1,
            }}
          />
        ))}

        <Tooltip title="Adicionar responsável" arrow>
          <IconButton
            onClick={() => viewContacts.onTrue()}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Iconify icon="mingcute:add-line" />
          </IconButton>
        </Tooltip>

        <KanbanContactsDialog
          onRemove={onRemove}
          onAppend={onAppend}
          assigneeValues={assignee}
          open={viewContacts.value}
          onClose={viewContacts.onFalse}
        />
      </Stack>
    </Stack>
  )
}
