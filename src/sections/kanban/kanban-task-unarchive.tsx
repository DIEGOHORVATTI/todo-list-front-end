import { mutate } from 'swr'

import { Button, Divider, MenuItem, Stack, Container } from '@mui/material'
import { Label } from '@/components/label'

import { DataGridCustom } from '@/components/data-grid-custom'
import { MenuPopover } from '@/components/MenuPopover'
import { Iconify } from '@/components/iconify'

import { useRequestSWR } from '@/hooks/use-request'

import { endpoints } from '@/constants/config'

import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'

import { axios } from '@/utils/axios'

import { useBoolean } from '@/hooks/use-boolean'

import { IKanbanColumn, IKanbanTask } from '@/types/kanban'
import { LabelColor } from '@/components/label/types'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/custom-dialog'

import { DatePicker } from '@mui/x-date-pickers'
import { CopyClipboard } from '@/components/CopyClipboard'

import { PriorityStatus } from '@/components/PriorityStatus'

export const ArchivedList = () => {
  const openDetails = useBoolean()

  const [task, setTask] = useState<IKanbanTask>()

  const { data: columns } = useRequestSWR<Array<IKanbanColumn>>({
    url: endpoints.columns.getAllColumns,
  })

  const { data: tasks } = useRequestSWR<Array<IKanbanTask>>({
    url: endpoints.tasks.getAllTasks,
  })

  const row = tasks
    ?.filter((task) => task.archived)
    .map((task) => {
      const isExistingColumn = columns?.find((column) => column.taskIds.includes(task._id))

      return { ...task, status: isExistingColumn ? isExistingColumn.name : '' }
    })

  const onUnarchiveTask = async (id: string) => {
    const task = await axios.get<IKanbanTask>(endpoints.tasks.getTask(id))

    await axios
      .put<IKanbanTask>(endpoints.tasks.updateTask(task.data._id), {
        ...task.data,
        archived: false,
      })
      .then(() => {
        enqueueSnackbar('Tarefa desarquivada com sucesso')

        mutate(endpoints.tasks.getAllTasks)
      })
  }

  const onDeleteTask = async (id: string) => {
    const task = await axios.get<IKanbanTask>(endpoints.tasks.getTask(id))

    await axios.delete<IKanbanTask>(endpoints.tasks.deleteTask(task.data._id)).then(() => {
      enqueueSnackbar('Tarefa deletada com sucesso')

      mutate(endpoints.tasks.getAllTasks)
    })
  }

  const priorityColorMap: Record<IKanbanTask['priority'], LabelColor> = {
    baixa: 'success',
    média: 'warning',
    alta: 'error',
  }

  return (
    <>
      <DataGridCustom<(IKanbanTask & { status: string }) | undefined>
        row={row || []}
        columns={[
          {
            field: '_id',
          },
          {
            field: 'name',
            headerName: 'Nome',
          },
          {
            field: 'priority',
            headerName: 'Prioridade',
            renderCell: ({ row }) => {
              const priorityColor = priorityColorMap[row?.priority || 'baixa']

              return <Label color={priorityColor}>{row?.priority}</Label>
            },
          },
          {
            field: 'status',
            headerName: 'Status',
          },
          {
            field: 'description',
            headerName: 'Descrição',
            flex: 1,
          },

          {
            field: 'dueDate',
            headerName: 'Data de entrega',
            width: 130,
            renderCell: ({ row }) => dayjs(row?.dueDate).format('DD/MM/YYYY'),
          },
          {
            headerName: 'Ações',
            width: 60,
            renderCell: ({ row }) => (
              <MenuPopover arrow="top-right" sx={{ width: 'max-content', p: 1 }}>
                <MenuItem
                  component={Button}
                  fullWidth
                  onClick={() => {
                    setTimeout(() => setTask(row as IKanbanTask), 0)
                    openDetails.onTrue()
                  }}
                >
                  <Stack direction="row">
                    <Iconify icon="solar:eye-bold-duotone" />
                    Visualizar
                  </Stack>
                </MenuItem>

                <MenuItem
                  component={Button}
                  fullWidth
                  onClick={() => row?._id && onUnarchiveTask(row._id)}
                  sx={{ color: 'warning.main' }}
                >
                  <Stack direction="row">
                    <Iconify icon="eva:archive-outline" />
                    Desarquivar
                  </Stack>
                </MenuItem>

                <Divider />

                <MenuItem
                  component={Button}
                  fullWidth
                  onClick={() => row?._id && onDeleteTask(row._id)}
                  sx={{ color: 'error.main' }}
                >
                  <Stack direction="row">
                    <Iconify icon="eva:trash-fill" />
                    Deletar
                  </Stack>
                </MenuItem>
              </MenuPopover>
            ),
          },
        ]}
      />

      {Boolean(openDetails.value) && (
        <ConfirmDialog
          open={openDetails.value}
          onClose={openDetails.onFalse}
          title={`Detalhes da tarefa ${task?.name}`}
          content={
            <Container>
              <Stack spacing={3}>
                <DatePicker
                  disabled
                  value={task?.dueDate ? new Date(task.dueDate) : new Date()}
                  label="Data de vencimento"
                  slotProps={{
                    actionBar: {
                      actions: ['today', 'accept'],
                    },
                  }}
                />

                <PriorityStatus priority={task?.priority || 'baixa'} />

                <CopyClipboard
                  fullWidth
                  multiline
                  label="Descrição"
                  value={task?.description || ''}
                />
              </Stack>
            </Container>
          }
        />
      )}
    </>
  )
}
