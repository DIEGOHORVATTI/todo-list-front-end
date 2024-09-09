import { mutate } from 'swr'
import { useState } from 'react'

import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import InputBase, { inputBaseClasses } from '@mui/material/InputBase'

import { axios } from '@/utils/axios'
import { enqueueSnackbar } from 'notistack'

import { priorityValues } from '@/shared/priorityValues'

import { endpoints } from '@/constants/config'

export const KanbanTaskAdd = ({ onCloseAddTask, column }) => {
  const [name, setName] = useState('')

  const handleAddTask = async (name) => {
    const response = await axios.post(endpoints.tasks.createTask, {
      name,
      archived: false,
      priority: priorityValues[0],
      description: '...',
      dueDate: new Date(),
    })

    await axios.put(endpoints.columns.updateColumn(column.id), {
      ...column,
      taskIds: [...column.taskIds, response.data._id],
    })

    enqueueSnackbar('Tarefa criada com sucesso')
    mutate(endpoints.columns.getAllColumns)
    mutate(endpoints.tasks.getAllTasks)

    onCloseAddTask()
  }

  const handleKeyUpAddTask = async (event) => {
    if (event.key === 'Enter') {
      await handleAddTask(name)
    }
  }

  const handleClickAddTask = () => {
    if (name) {
      handleAddTask(name)
    } else {
      onCloseAddTask()
    }
  }

  const handleChangeName = (event) =>
    setName(event.target.value)

  return (
    <ClickAwayListener onClickAway={handleClickAddTask}>
      <Paper
        sx={{
          borderRadius: 1.5,
          bgcolor: 'background.default',
          boxShadow: (theme) => theme.customShadows.z1,
        }}
      >
        <InputBase
          autoFocus
          fullWidth
          placeholder="Task name"
          value={name}
          onChange={handleChangeName}
          onKeyUp={handleKeyUpAddTask}
          sx={{
            px: 2,
            height: 56,
            [`& .${inputBaseClasses.input}`]: {
              typography: 'subtitle2',
            },
          }}
        />
      </Paper>
    </ClickAwayListener>
  )
}
