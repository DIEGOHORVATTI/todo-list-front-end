import { Iconify } from '@/components'
import { PriorityStatus } from '@/components/PriorityStatus'
import { endpoints } from '@/constants/config'
import { useRequest } from '@/hooks/use-request'
import { IKanbanTask } from '@/types/kanban'
import { Notification } from '@/types/Notification'
import { User } from '@/types/user'
import { axios } from '@/utils/axios'
import { Button, Chip, Divider, Paper, Stack, styled, Typography } from '@mui/material'

import dayjs from 'dayjs'
import { mutate } from 'swr'

export const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}))

type Props = {
  notifications: Array<Notification> | undefined
}

export const Notifications = ({ notifications }: Props) => {
  const { data: tasks } = useRequest<Array<IKanbanTask>>({
    url: endpoints.tasks.getAllTasks,
  })

  const { data: users } = useRequest<Array<User>>({
    url: endpoints.user.getAllUsers,
  })

  const handleMarkAsRead = (notification: Notification) =>
    axios
      .put(endpoints.notifications.deleteNotification(notification._id), {
        ...notification,
        view: true,
      })
      .then(() => mutate(endpoints.notifications.getAllNotifications))

  return tasks
    ?.filter((task) => notifications?.some((notification) => notification.taskId === task._id))
    .map((task, index) => {
      const notificationsTaks = notifications?.filter(
        (notification) => notification.taskId === task._id
      )

      return (
        <Paper key={index} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.neutral', my: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="h6">{task.name}</Typography>

            <Typography variant="inherit">
              ({notificationsTaks?.filter((notification) => !notification.view).length}) Não lidas
            </Typography>
          </Stack>

          {notificationsTaks?.map((notification, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', my: 2 }}
            >
              <Stack direction="column" alignItems="left" spacing={1}>
                <Stack direction="column">
                  <Typography variant="h6">{notification.title}</Typography>
                  <Typography variant="caption">
                    {dayjs(notification.createdAt).format('DD/MM/YYYY')}
                  </Typography>
                </Stack>

                <Typography variant="body2">{notification.description}</Typography>

                <Stack direction="column" alignItems="left" spacing={1}>
                  <StyledLabel>Responsáveis</StyledLabel>

                  <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
                    {notification.assignee?.map((notification, index) => {
                      const user = users?.find((user) => user._id === notification.userId)

                      return (
                        <Chip
                          key={index}
                          label={user?.name}
                          variant="soft"
                          sx={{
                            color: 'text.primary',
                            borderRadius: 1,
                          }}
                        />
                      )
                    })}
                  </Stack>
                </Stack>

                <Divider />

                <PriorityStatus priority={notification.priority} />

                <Stack alignItems="flex-end" spacing={1}>
                  {notification.view ? (
                    <Button
                      variant="soft"
                      color="success"
                      startIcon={<Iconify icon="charm:tick-double" />}
                    >
                      Já Lido
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={() => handleMarkAsRead(notification)}
                      startIcon={<Iconify icon="charm:tick-double" />}
                    >
                      Marcar como Lido
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Paper>
      )
    })
}
