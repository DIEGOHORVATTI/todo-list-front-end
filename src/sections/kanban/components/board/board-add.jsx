import { useState } from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { inputBaseClasses } from '@mui/material/InputBase'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { useBoolean } from '@/hooks/use-boolean'

import { axios } from '@/utils/axios'
import { mutate } from 'swr'

import { Iconify } from '@/components/iconify'
import { endpoints } from '@/constants/config'

export const KanbanBoardAdd = () => {
  const [boardName, setBoardName] = useState('')

  const openAddBoard = useBoolean()

  const createBoard = async ({ name }) => {
    await axios
      .post(endpoints.boards.createBoard, {
        name,
        ordered: [],
        columnIds: [],
      })
      .then(() => mutate(endpoints.boards.getAllBoards))
  }

  const handleChangeName = (event) =>
    setBoardName(event.target.value)

  const handleCreateBoard = async () => {
    if (boardName) {
      createBoard({ name: boardName })
      setBoardName('')
    }
    openAddBoard.onFalse()
  }

  const handleKeyUpCreateColumn = (event) => {
    if (event.key === 'Enter') {
      handleCreateBoard()
    }
  }

  return (
    <>
      {openAddBoard.value ? (
        <ClickAwayListener onClickAway={handleCreateBoard}>
          <TextField
            autoFocus
            size="small"
            placeholder="Novo Quadro"
            value={boardName}
            onChange={handleChangeName}
            onKeyUp={handleKeyUpCreateColumn}
            sx={{
              mx: 2,
              minWidth: 250,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              padding: 0,
              [`& .${inputBaseClasses.input}`]: {
                padding: 0,
                height: 10,
                minWidth: 250,
                border: 'none',
                typography: 'h6',
              },
            }}
          />
        </ClickAwayListener>
      ) : (
        <Button
          variant="soft"
          sx={{ border: '1px dashed', borderColor: 'text.secondary', minWidth: '150px' }}
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={openAddBoard.onTrue}
        >
          Quadro
        </Button>
      )}
    </>
  )
}
