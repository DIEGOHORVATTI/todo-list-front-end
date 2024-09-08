import { useState } from 'react'
import { mutate } from 'swr'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { inputBaseClasses } from '@mui/material/InputBase'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { useBoolean } from '@/hooks/use-boolean'

import { Iconify } from '@/components/iconify'
import { IKanbanBoard, IKanbanColumn } from '@/types/kanban'
import { axios } from '@/utils/axios'
import { endpoints } from '@/constants/config'
import { enqueueSnackbar } from 'notistack'
import { Typography } from '@mui/material'

type Props = {
  board: IKanbanBoard | undefined
}

export const KanbanColumnAdd = ({ board }: Props) => {
  const [columnName, setColumnName] = useState('')

  const openAddColumn = useBoolean()

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setColumnName(event.target.value)

  if (!board) return null

  const createColumn = async (columnData: Pick<IKanbanColumn, 'name'>) =>
    await axios
      .post<{ items: IKanbanColumn; message: string }>(endpoints.columns.createColumn, {
        ...columnData,
        boardId: board.id,
        taskIds: [],
        archived: false,
      })
      .then(async (response) => {
        await axios
          .put(endpoints.boards.updateBoard(board.id), {
            ...board,
            ordered: [...board.ordered, response.data.items.id],
          })
          .then(() => mutate(endpoints.boards.getAllBoards))

        enqueueSnackbar(response.data.message)

        mutate(endpoints.columns.getAllColumns)
      })

  const handleCreateColumn = () => {
    if (columnName) {
      createColumn({ name: columnName })
      setColumnName('')
    }

    openAddColumn.onFalse()
  }

  const handleKeyUpCreateColumn = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCreateColumn()
    }
  }

  return (
    <Paper>
      {openAddColumn.value ? (
        <ClickAwayListener onClickAway={handleCreateColumn}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Nova Coluna"
            value={columnName}
            onChange={handleChangeName}
            onKeyUp={handleKeyUpCreateColumn}
            sx={{
              [`& .${inputBaseClasses.input}`]: {
                height: 17,
                minWidth: 250,
                border: 'none',
                typography: 'h6',
              },
            }}
          />
        </ClickAwayListener>
      ) : (
        <Button
          fullWidth
          variant="soft"
          sx={{
            border: '1px dashed',
            borderColor: 'text.secondary',
            minHeight: 50,
            width: 200,
          }}
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={openAddColumn.onTrue}
        >
          <Typography variant="h6" sx={{ fontWeight: 550 }}>
            Coluna
          </Typography>
        </Button>
      )}
    </Paper>
  )
}
