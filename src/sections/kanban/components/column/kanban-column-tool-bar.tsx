import { useRef, useState, useEffect } from 'react'
import { mutate } from 'swr'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

import { useBoolean } from '@/hooks/use-boolean'

import { Iconify } from '@/components/iconify'
import { ConfirmDialog } from '@/components/custom-dialog'
import CustomPopover, { usePopover } from '@/components/custom-popover'
import KanbanInputName from '../kanban-input-name'
import { enqueueSnackbar } from 'notistack'
import { IKanban, IKanbanColumn } from '@/types/kanban'
import { axios } from '@/utils/axios'
import { endpoints } from '@/constants/config'

type Props = Partial<Pick<IKanban, 'tasks'>> & {
  columnName: string
  column: IKanbanColumn
}

export const KanbanColumnToolBar = ({ columnName, column, tasks }: Props) => {
  const renameRef = useRef<HTMLInputElement>(null)

  const popover = usePopover()

  const confirmDialog = useBoolean()

  const [name, setName] = useState(columnName)

  const handleUpdateColumn = async (name: string) =>
    await axios.put(endpoints.columns.updateColumn(column.id), { ...column, name }).then(() => {
      enqueueSnackbar('Nome atualizado com sucesso!')

      mutate(endpoints.columns.getAllColumns)
    })

  const handleDeleteColumn = async () =>
    await axios
      .put<IKanbanColumn>(endpoints.columns.updateColumn(column.id), { ...column, archived: true })
      .then((column) => {
        enqueueSnackbar('Coluna arquivada com sucesso!')

        column.data.taskIds.forEach(async (taskId) => {
          if (!tasks) return
          if (!tasks[taskId]) return

          await axios
            .put(endpoints.tasks.updateTask(taskId), {
              ...tasks[taskId],
              archived: true,
            })
            .then(() => {
              enqueueSnackbar('Tarefas arquivadas com sucesso!')
              mutate(endpoints.tasks.getAllTasks)
            })
        })

        mutate(endpoints.boards.getAllBoards)
        mutate(endpoints.columns.getAllColumns)
      })

  useEffect(() => {
    if (popover.open) {
      if (renameRef.current) {
        renameRef.current.focus()
      }
    }
  }, [popover.open])

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value)

  const handleKeyUpUpdateColumn = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (renameRef.current) {
        renameRef.current.blur()
      }

      handleUpdateColumn(name)
    }
  }

  return (
    <>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pt: 3 }}
      >
        <KanbanInputName
          inputRef={renameRef}
          placeholder="Section name"
          value={name}
          onChange={handleChangeName}
          onKeyUp={handleKeyUpUpdateColumn}
        />

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          ml: 1.5,
          width: 160,
        }}
      >
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue()
            popover.onClose()
          }}
          sx={{ color: 'warning.main' }}
        >
          <Iconify icon="solar:archive-bold" />
          Arquivar
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content={
          <>
            Você tem certeza que deseja deletar está coluna <strong>{columnName}</strong>?
            <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
              <strong> Atenção: </strong> Todos os cards desta coluna serão deletados.
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteColumn()
              confirmDialog.onFalse()
            }}
          >
            Arquivar
          </Button>
        }
      />
    </>
  )
}
