'use client'

import { useMemo } from 'react'

export const boardMescle = ({ selectedBoard, boards, columns, tasks }) => {
  return useMemo(() => {
    if (!selectedBoard) {
      return null
    }

    const board = boards?.find((board) => board.id === selectedBoard)

    if (!board) {
      return null
    }

    const columnsFiltered = columns?.filter(
      (column) => column.boardId === selectedBoard && !column.archived
    )

    const columnsMapped = columnsFiltered?.reduce((acc, column) => {
      acc[column.id] = column
      return acc
    }, {})

    const tasksFiltered = tasks?.filter((task) =>
      columnsFiltered?.some((column) => column.taskIds.includes(task._id))
    )

    const tasksMapped = tasksFiltered?.reduce((acc, task) => {
      acc[task._id] = task
      return acc
    }, {})

    return {
      ...board,
      columns: columnsMapped,
      tasks: tasksMapped,
    }
  }, [boards, columns, tasks, selectedBoard])
}
