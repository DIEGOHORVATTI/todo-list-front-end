import { useEffect, useState } from 'react'

import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'

import { hideScroll } from '@/theme/css'

import { useRequestSWR } from '@/hooks/use-request'

import { endpoints } from '@/constants/config'

import { Button, ButtonGroup, Grid, Paper } from '@mui/material'

import { KanbanColumnSkeleton } from './components/kanban-skeleton'
import { KanbanColumnAdd } from './components/column/kanban-column-add'
import { KanbanColumn } from './components/column/kanban-column'

import { onDragEnd } from './shared/onDragEnd'
import { boardMescle } from './shared/boardMescle'

import { ArchivedList } from './kanban-task-unarchive'

import { KanbanBoardAdd } from '@/sections/kanban/components/board/board-add'
import { BoardActions } from '@/sections/kanban/components/board/board-actions'

export const KanbanView = () => {
  const { data: boards, isLoading } = useRequestSWR({
    url: endpoints.boards.getAllBoards,
  })

  const { data: columns } = useRequestSWR({
    url: endpoints.columns.getAllColumns,
  })

  const { data: tasks } = useRequestSWR({
    url: endpoints.tasks.getAllTasks,
  })

  const [showArchived, setShowArchived] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null)

  const board = boardMescle({ selectedBoard, boards, columns, tasks })

  useEffect(() => {
    if (selectedBoard === null && boards?.length) {
      setSelectedBoard(boards[0]?.id)
    }
  }, [boards])

  return (
    <Container maxWidth="xl" sx={{ mt: 1 }}>
      {isLoading && (
        <Stack direction="row" alignItems="flex-start" spacing={3}>
          {[...Array(4)].map((_, index) => (
            <KanbanColumnSkeleton key={index} index={index} />
          ))}
        </Stack>
      )}

      {!isLoading && (
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Paper
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: 'background.neutral',
              }}
            >
              <ButtonGroup>
                <Button
                  variant="soft"
                  color="inherit"
                  onClick={() => setShowArchived((prevState) => !prevState)}
                >
                  {showArchived ? 'Quadros' : 'Arquivados'}
                </Button>
              </ButtonGroup>
            </Paper>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{
                p: 1,
                width: '100%',
                backgroundColor: 'background.neutral',
                borderRadius: 1,
              }}
            >
              <KanbanBoardAdd />

              <Grid container sx={{ borderRadius: '0 0 10px 10px', width: '100%' }}>
                <Grid item xs={12} sx={{ width: 100 }}>
                  <Stack sx={{ width: '100%', maxHeight: 500 }}>
                    <Stack direction="row" sx={{ overflowX: 'auto' }} spacing={1}>
                      {boards?.map((board, index) => (
                        <BoardActions key={index} {...{ setSelectedBoard, selectedBoard, board }} />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Stack>

          {showArchived && <ArchivedList />}

          <DragDropContext onDragEnd={onDragEnd(board)}>
            <Droppable droppableId="board" type="COLUMN" direction="horizontal">
              {(provided) =>
                !showArchived && (
                  <Stack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    spacing={1}
                    direction="row"
                    alignItems="flex-start"
                    sx={{
                      p: 0.25,
                      height: 1,
                      overflowY: 'hidden',
                      ...hideScroll.x,
                    }}
                  >
                    {board?.ordered?.map(
                      (columnId, index) =>
                        !board?.columns[columnId]?.archived && (
                          <KanbanColumn
                            key={columnId}
                            index={index}
                            column={board?.columns[columnId]}
                            tasks={board?.tasks}
                          />
                        )
                    )}

                    {provided.placeholder}

                    {selectedBoard && (
                      <KanbanColumnAdd
                        board={boards?.find((board) => board.id === selectedBoard)}
                      />
                    )}
                  </Stack>
                )
              }
            </Droppable>
          </DragDropContext>
        </Stack>
      )}
    </Container>
  )
}
