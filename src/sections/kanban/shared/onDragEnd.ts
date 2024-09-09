import { mutate } from 'swr'

import { axios } from '@/utils/axios'

import { DropResult } from '@hello-pangea/dnd'

import { endpoints } from '@/constants/config'

import { IKanban, IKanbanBoard, IKanbanColumn } from '@/types/kanban'

export const onDragEnd =
  (board: IKanbanBoard & Pick<IKanban, 'columns' | 'tasks'>) =>
  async ({ destination, source, draggableId, type }: DropResult) => {
    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Moving column
    if (type === 'COLUMN') {
      const newOrdered = [...board.ordered]

      newOrdered.splice(source.index, 1)

      newOrdered.splice(destination.index, 0, draggableId)

      await axios
        .put<IKanbanBoard>(endpoints.boards.updateBoard(board.id), {
          ...board,
          ordered: newOrdered,
        })
        .then(({ data }) => {
          mutate<Array<IKanbanBoard>>(
            endpoints.boards.getAllBoards,
            (items) => {
              const boards = items?.map((item) => {
                if (item.id === data.id) {
                  return { ...item, ...data }
                }

                return item
              })

              return boards
            },
            false
          )
        })

      return
    }

    const sourceColumn = board?.columns[source.droppableId]

    const destinationColumn = board?.columns[destination.droppableId]

    // Moving task to same list
    if (sourceColumn.id === destinationColumn.id) {
      const newTaskIds = [...sourceColumn.taskIds]

      newTaskIds.splice(source.index, 1)

      newTaskIds.splice(destination.index, 0, draggableId)

      axios
        .put<IKanbanColumn>(endpoints.columns.updateColumn(sourceColumn.id), {
          ...sourceColumn,
          taskIds: newTaskIds,
        })
        .then(({ data }) => {
          mutate<Array<IKanbanColumn>>(
            endpoints.columns.getAllColumns,
            (items) => {
              const columns = items?.map((item) => {
                if (item.id === data.id) {
                  return { ...item, ...data }
                }

                return item
              })

              return columns
            },
            false
          )
        })

      return
    }

    // Moving task to different list
    const sourceTaskIds = [...sourceColumn.taskIds]

    const destinationTaskIds = [...destinationColumn.taskIds]

    // Remove from source
    sourceTaskIds.splice(source.index, 1)

    // Insert into destination
    destinationTaskIds.splice(destination.index, 0, draggableId)

    await axios.put<IKanbanColumn>(endpoints.columns.updateColumn(sourceColumn.id), {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    })

    await axios.put<IKanbanColumn>(endpoints.columns.updateColumn(destinationColumn.id), {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    })

    mutate(endpoints.columns.getAllColumns)
  }
