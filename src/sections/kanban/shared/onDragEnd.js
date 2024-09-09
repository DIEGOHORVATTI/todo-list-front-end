import { mutate } from 'swr'

import { axios } from '@/utils/axios'

import { endpoints } from '@/constants/config'

export const onDragEnd =
  (board) =>
    async ({ destination, source, draggableId, type }) => {
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
          .put(endpoints.boards.updateBoard(board.id), {
            ...board,
            ordered: newOrdered,
          })
          .then((data) => {
            mutate(endpoints.boards.getAllBoards, (items) => {
              const boards = items.map((item) => {
                if (item.id === data.id) {
                  return data
                }

                return item
              })

              return boards
            })
          }, false)

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
          .put(endpoints.columns.updateColumn(sourceColumn.id), {
            ...sourceColumn,
            taskIds: newTaskIds,
          })
          .then((data) => {
            mutate(endpoints.columns.getAllColumns, (items) => {
              const columns = items.map((item) => {
                if (item.id === data.id) {
                  return data
                }

                return item
              })

              return columns
            })
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

      await axios.put(endpoints.columns.updateColumn(sourceColumn.id), {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      })

      await axios.put(endpoints.columns.updateColumn(destinationColumn.id), {
        ...destinationColumn,
        taskIds: destinationTaskIds,
      })

      mutate(endpoints.columns.getAllColumns, (items) => {
        const columns = items.map((item) => {
          if (item.id === sourceColumn.id) {
            return {
              ...sourceColumn,
              taskIds: sourceTaskIds,
            }
          }

          if (item.id === destinationColumn.id) {
            return {
              ...destinationColumn,
              taskIds: destinationTaskIds,
            }
          }

          return item
        })

        return columns
      }, false)
    }
