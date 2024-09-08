import { useState } from 'react'

import { alpha } from '@mui/material/styles'

import Stack from '@mui/material/Stack'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'

import IconButton from '@mui/material/IconButton'

import { useBoolean } from '@/hooks/use-boolean'

import { Iconify } from '@/components/iconify'

import KanbanInputName from '../kanban-input-name'

import { Autocomplete, Chip, TextField, useTheme } from '@mui/material'

import { ConfirmDialog } from '@/components/custom-dialog'

import { enqueueSnackbar } from 'notistack'

import FormProvider from '@/components/hook-form/form-provider'

import { RHFDatePiker } from '@/components/hook-form/rhf-date-piker'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { axios } from '@/utils/axios'
import { paper } from '@/theme/css'

import { categoriesStorage, endpoints, userCurrencyStorage } from '@/constants/config'

import { PriorityValues, priorityValues } from '@/shared/priorityValues'
import { mutate } from 'swr'
import { isEqual } from 'lodash'

import { RHFTextField } from '@/components/hook-form'
import { RHFUpload } from '@/components/hook-form/rhf-upload'
import { PriorityStatus } from '@/components/PriorityStatus'

import { IKanbanTask } from '@/types/kanban'

type Props = {
  task: IKanbanTask
  openDetails: boolean
  onCloseDetails: VoidFunction
}

type AddTask = Omit<IKanbanTask, 'history'>

export default function KanbanDetails({ task, openDetails, onCloseDetails }: Props) {
  const theme = useTheme()

  const confirmArchive = useBoolean()
  const confirmDelete = useBoolean()

  const [taskName, setTaskName] = useState(task.name)

  const UpdateUserSchema = Yup.object<AddTask>().shape({
    _id: Yup.string().required(),
    name: Yup.string().required(),
    files: Yup.mixed<Array<File>>().optional(),
    archived: Yup.boolean().required(),
    priority: Yup.mixed<PriorityValues>().oneOf(priorityValues).required(),
    categories: Yup.array().of(Yup.string().required()).optional(),
    description: Yup.string().required(),
    assignee: Yup.array()
      .of(
        Yup.object({
          _id: Yup.string().required(),
          userId: Yup.string().required(),
        })
      )
      .optional(),
    dueDate: Yup.date().required(),
    userId: Yup.string().required(),
  })

  const methods = useForm<AddTask>({
    defaultValues: task,
    resolver: yupResolver<AddTask>(UpdateUserSchema),
  })

  const { handleSubmit, setValue, watch, control } = methods

  const { priority } = watch()
  const values = watch()

  const isDirtyTask = isEqual(task, values)

  const onUpdateTask = async (task: AddTask) =>
    await axios
      .put(endpoints.tasks.updateTask(task._id), {
        ...task,
        userName: userCurrencyStorage,
      })
      .then(() => {
        enqueueSnackbar('Tarefa atualizada com sucesso')

        mutate(endpoints.tasks.getAllTasks)
      })

  const onArchiveTask = async (taskId: string) =>
    await axios
      .put(endpoints.tasks.updateTask(taskId), {
        ...task,
        archived: true,
      })
      .then(() => {
        enqueueSnackbar('Tarefa arquivada com sucesso')

        onCloseDetails()
        mutate(endpoints.tasks.getAllTasks)
      })

  const onDeleteTask = async (taskId: string) =>
    await axios.delete(endpoints.tasks.updateTask(taskId)).then(() => {
      enqueueSnackbar('Tarefa deletada com sucesso')

      onCloseDetails()
      mutate(endpoints.tasks.getAllTasks)
    })

  const onUpdateFiles = async (files: Array<File>) =>
    await axios.put(endpoints.tasks.updateTask(task._id), { ...task, files }).then(() => {
      enqueueSnackbar('Arquivo deletado com sucesso')

      mutate(endpoints.tasks.getAllTasks)
    })

  const handleSubmitForm = async (data: AddTask) => {
    await axios.put(endpoints.tasks.updateTask(data._id), data).then(() => {
      enqueueSnackbar('Tarefa atualizada com sucesso')

      mutate(endpoints.tasks.getAllTasks)
    })
  }

  const handleChangeTaskName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTaskName(event.target.value)

  const handleUpdateTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (taskName) {
        onUpdateTask({
          ...task,
          name: taskName,
        })
      }
    }
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleSubmitForm)}>
        <Drawer
          disablePortal
          open={openDetails}
          onClose={onCloseDetails}
          anchor="right"
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: {
              width: {
                xs: 1,
                sm: 480,
              },
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} p={2}>
            <KanbanInputName
              fullWidth
              placeholder="Nome da tarefa"
              value={taskName}
              onChange={handleChangeTaskName}
              onKeyUp={handleUpdateTask}
            />

            <IconButton color="default" onClick={onCloseDetails}>
              <Iconify icon="eva:close-fill" size={2.5} />
            </IconButton>
          </Stack>

          <Stack direction="column" justifyContent="space-between" height="100%">
            <Stack spacing={3} sx={{ p: 2 }}>
              <RHFDatePiker<{ dueDate: Date }> label="Data de vencimento" name="dueDate" />

              <PriorityStatus
                priority={priority}
                onChange={(priority) => setValue('priority', priority)}
              />

              <Controller
                name="categories"
                control={control}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { ref, onChange, ...restField }, fieldState: { error } }) => {
                  return (
                    <Autocomplete
                      {...restField}
                      multiple
                      fullWidth
                      options={[...new Set([...categoriesStorage, ...(task?.categories || [])])]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(error)}
                          label="Categorias"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              padding: '0px 10px !important',
                            },
                          }}
                          placeholder="Digite para adicionar"
                        />
                      )}
                      onChange={(_, data) => onChange(data)}
                      filterOptions={(options, params) => {
                        const filtered = options.filter((option) =>
                          option.toLowerCase().includes(params.inputValue.toLowerCase())
                        )

                        if (params.inputValue !== '') {
                          filtered.push(params.inputValue)
                        }

                        return filtered
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            color="default"
                            {...getTagProps({ index })}
                            sx={{
                              borderColor: 'background.neutral',
                              backgroundColor: 'background.neutral',
                              borderRadius: 1,
                              alignItems: 'center',
                            }}
                            deleteIcon={<Iconify icon="eva:close-fill" />}
                            key={Math.random()}
                          />
                        ))
                      }
                    />
                  )
                }}
              />

              <RHFTextField fullWidth multiline name="description" label="Descrição" />

              <RHFUpload multiple name="files" onUpdateFiles={onUpdateFiles} />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                zIndex: 1,
                p: 2,
                bottom: 0,
                borderTop: 1,
                position: 'sticky',
                borderColor: 'divider',
                ...paper({ theme }),
              }}
            >
              <IconButton
                color="error"
                onClick={confirmDelete.onTrue}
                sx={{ backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08) }}
              >
                <Iconify icon="tabler:trash-filled" />
              </IconButton>

              <Button
                fullWidth
                onClick={confirmArchive.onTrue}
                startIcon={<Iconify icon="solar:archive-bold" />}
                variant="outlined"
                color="warning"
              >
                Arquivar
              </Button>

              <Button fullWidth disabled={isDirtyTask} type="submit" variant="contained">
                Salvar
              </Button>
            </Stack>
          </Stack>

          <ConfirmDialog
            open={confirmDelete.value}
            onClose={confirmDelete.onFalse}
            title="Deletar"
            disablePortal={false}
            content={<>Tem certeza que deseja deletar esta tarefa?</>}
            action={
              <Button variant="contained" color="error" onClick={() => onDeleteTask(task._id)}>
                Deletar
              </Button>
            }
          />

          <ConfirmDialog
            open={confirmDelete.value}
            onClose={confirmDelete.onFalse}
            title="Deletar"
            disablePortal={false}
            content={<>Tem certeza que deseja deletar esta tarefa?</>}
            action={
              <Button variant="contained" color="error" onClick={() => onDeleteTask(task._id)}>
                Deletar
              </Button>
            }
          />

          <ConfirmDialog
            open={confirmArchive.value}
            onClose={confirmArchive.onFalse}
            title="Arquivar"
            disablePortal={false}
            content={<>Tem certeza que deseja arquivar esta tarefa?</>}
            action={
              <Button variant="contained" color="warning" onClick={() => onArchiveTask(task._id)}>
                Arquivar
              </Button>
            }
          />
        </Drawer>
      </FormProvider>
    </>
  )
}
