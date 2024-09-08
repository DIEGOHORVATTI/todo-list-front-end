import { useState } from 'react'

import { styled, alpha } from '@mui/material/styles'

import Stack from '@mui/material/Stack'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import Tooltip from '@mui/material/Tooltip'

import IconButton from '@mui/material/IconButton'

import { useBoolean } from '@/hooks/use-boolean'

import { Iconify } from '@/components/iconify'

import KanbanInputName from '../kanban-input-name'

import {
  Autocomplete,
  ButtonGroup,
  Chip,
  Divider,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import { ConfirmDialog } from '@/components/custom-dialog'

import { enqueueSnackbar } from 'notistack'

import FormProvider from '@/components/hook-form/form-provider'

import { RHFDatePiker } from '@/components/hook-form/rhf-date-piker'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { axios } from '@/utils/axios'
import { paper } from '@/theme/css'

import { categoriesStorage, endpoints, userCurrencyStorage } from '@/constants/config'

import { PriorityValues, priorityValues } from '@/shared/priorityValues'
import { mutate } from 'swr'
import { isEqual } from 'lodash'
import dayjs from 'dayjs'

import { RHFTextField } from '@/components/hook-form'
import { RHFUpload } from '@/components/hook-form/rhf-upload'
import { PriorityStatus } from '@/components/PriorityStatus'

import { useRequest } from '@/hooks/use-request'
import { NotificationAdd } from '@/sections/notifications/notification-add'

import { Responsible } from './Responsible'

import { IKanbanTask } from '@/types/kanban'
import { Notification } from '@/types/Notification'

import { User } from '@/types/user'

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}))

type Props = {
  task: IKanbanTask
  openDetails: boolean
  onCloseDetails: VoidFunction
}

type AddTask = Omit<IKanbanTask, 'history'>

export default function KanbanDetails({ task, openDetails, onCloseDetails }: Props) {
  const theme = useTheme()

  const openAddNotification = useBoolean()

  const confirmArchive = useBoolean()
  const confirmDelete = useBoolean()

  const viewHistory = useBoolean()

  const { data: user } = useRequest<User>({
    url: endpoints.user.getUserById(task.userId),
  })

  const { data: users } = useRequest<Array<User>>({
    url: endpoints.user.getAllUsers,
  })

  const { data: notifications } = useRequest<Array<Notification>>({
    url: endpoints.notifications.getAllNotifications,
  })

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

  const assignee = useFieldArray({
    control,
    name: 'assignee',
  })

  const { priority } = watch()
  const values = watch()

  const isPermissionDeleteNotification = user?.permissions === 'admin' || task.userId === user?._id

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

  const onDeleteNotification = async (notificationId: string) =>
    await axios.delete(endpoints.notifications.deleteNotification(notificationId)).then(() => {
      enqueueSnackbar('Notificação deletada com sucesso')

      mutate(endpoints.notifications.getAllNotifications)
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

  const isNotification = notifications?.some(({ taskId }) => taskId === task._id)

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
              {isNotification && (
                <>
                  <Stack direction="column" alignItems="left" spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StyledLabel>Notificações Abertas</StyledLabel>

                      <Tooltip
                        arrow
                        title="Para ver as notificações abra o icone de notificações na home"
                      >
                        <IconButton>
                          <Iconify icon="eva:question-mark-circle-fill" />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                      {notifications
                        ?.filter((notification) => notification.taskId === task._id)
                        .map((notification) => (
                          <Chip
                            key={notification._id}
                            {...(isPermissionDeleteNotification && {
                              onDelete: () => onDeleteNotification(notification._id),
                            })}
                            label={notification.title}
                            variant="soft"
                            sx={{
                              color: 'text.primary',
                              borderRadius: 1,
                            }}
                          />
                        ))}
                    </Stack>
                  </Stack>

                  <Divider />
                </>
              )}

              <Stack direction="column" alignItems="left" spacing={1}>
                <StyledLabel>Criado por</StyledLabel>

                <Avatar alt={user?.name} color="secondary">
                  <Tooltip title={user?.name}>
                    <Typography variant="button">{user?.name.slice(0, 3).toUpperCase()}</Typography>
                  </Tooltip>
                </Avatar>
              </Stack>

              <Responsible
                assignee={values.assignee}
                onAppend={assignee.append}
                onRemove={assignee.remove}
              />

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

              <Divider />

              <ButtonGroup fullWidth>
                <Button
                  fullWidth
                  onClick={openAddNotification.onTrue}
                  startIcon={<Iconify icon="mdi:bell-plus" />}
                  variant="soft"
                  color="inherit"
                >
                  Notificação
                </Button>

                <Button
                  fullWidth
                  onClick={viewHistory.onTrue}
                  startIcon={<Iconify icon="mdi:file-restore" />}
                  variant="soft"
                  color="inherit"
                >
                  Ver histórico
                </Button>
              </ButtonGroup>
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

          <ConfirmDialog
            open={viewHistory.value}
            onClose={viewHistory.onFalse}
            title="Histórico"
            disablePortal={false}
            content={
              <>
                <Stack direction="column" spacing={1}>
                  <Typography variant="body2">Histórico de alterações da tarefa</Typography>

                  {task.history?.map((history, index) => {
                    const user = users?.find((user) => user._id === history.userId)

                    return (
                      <Stack key={index} direction="row" spacing={1}>
                        <Typography variant="body2">
                          {dayjs(history?.date).format('DD/MM/YYYY HH:mm')}
                        </Typography>

                        <Typography variant="body2">{user?.name}</Typography>
                      </Stack>
                    )
                  })}
                </Stack>
              </>
            }
          />
        </Drawer>
      </FormProvider>

      <NotificationAdd openAddNotification={openAddNotification} taskId={task._id} />
    </>
  )
}
