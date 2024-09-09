'use client'

import { useMemo } from 'react'

import { IKanban, IKanbanBoard, IKanbanColumn, IKanbanTask } from '@/types/kanban'

type Props = {
  selectedBoard: string | null
  boards: IKanbanBoard[] | undefined
  columns: IKanbanColumn[] | undefined
  tasks: IKanbanTask[] | undefined
}

export const boardMescle = ({ selectedBoard, boards, columns, tasks }: Props) => {
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
    }, {} as Record<string, IKanbanColumn>)

    const tasksFiltered = tasks?.filter((task) =>
      columnsFiltered?.some((column) => column.taskIds.includes(task._id))
    )

    const tasksMapped = tasksFiltered?.reduce((acc, task) => {
      acc[task._id] = task
      return acc
    }, {} as Record<string, IKanbanTask>)

    return {
      ...board,
      columns: columnsMapped,
      tasks: tasksMapped,
    }
  }, [boards, columns, tasks, selectedBoard]) as IKanbanBoard & Pick<IKanban, 'columns' | 'tasks'>
}
