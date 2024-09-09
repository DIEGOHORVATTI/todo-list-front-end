import { Droppable, Draggable } from '@hello-pangea/dnd'

import { alpha } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'

import { useBoolean } from '@/hooks/use-boolean'

import { KanbanTaskAdd } from '../tasks/kanban-task-add'
import { KanbanTaskItem } from '../tasks/kanban-task-item'
import { KanbanColumnToolBar } from './kanban-column-tool-bar'

import { Iconify } from '@/components/iconify'

import { IKanban, IKanbanColumn } from '@/types/kanban'

type Props = Partial<Pick<IKanban, 'tasks'>> & {
  column: IKanbanColumn | undefined
  index: number
}

export const KanbanColumn = ({ column, tasks, index }: Props) => {
  const openAddTask = useBoolean()

  if (!column) return null

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            px: 2,
            borderRadius: 2,
            ...(snapshot.isDragging && {
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.24),
            }),
            backgroundColor: 'background.neutral',
          }}
        >
          <Stack {...provided.dragHandleProps} spacing={2} py={1}>
            <KanbanColumnToolBar columnName={column.name} column={column} tasks={tasks} />

            <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 255px)' }}>
              <Droppable droppableId={column.id} type="TASK">
                {(dropProvided) => (
                  <Stack
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    spacing={2}
                    sx={{
                      py: 3,
                      width: 280,
                    }}
                  >
                    {column.taskIds.map((taskId, taskIndex) => {
                      if (!tasks) return null
                      if (!tasks[taskId]) return null
                      if (tasks[taskId].archived) return null

                      return <KanbanTaskItem key={taskId} index={taskIndex} task={tasks[taskId]} />
                    })}

                    {openAddTask.value && (
                      <KanbanTaskAdd onCloseAddTask={openAddTask.onFalse} column={column} />
                    )}

                    {dropProvided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </Box>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openAddTask.onToggle}
            >
              {openAddTask.value ? 'Cancelar' : 'Tarefa'}
            </Button>
          </Stack>
        </Paper>
      )}
    </Draggable>
  )
}
