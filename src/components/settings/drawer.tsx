'use client'

import { mutate } from 'swr'

import { useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import Drawer, { drawerClasses } from '@mui/material/Drawer'
import { Alert, alpha, Box, MenuItem, Paper } from '@mui/material'

import { enqueueSnackbar } from 'notistack'

import { paper } from '@/theme/css'

import { Iconify } from '@/components/iconify'

import { useRequest } from '@/hooks/use-request'

import { SettingsContextProps } from '.'
import { endpoints, userCurrencyStorage, userNamesStorage } from '@/constants/config'

import { useForm } from 'react-hook-form'
import { RHFSelect, RHFTextField } from '../hook-form'
import FormProvider from '../hook-form/form-provider'

import { axios } from '@/utils/axios'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { useBoolean } from '@/hooks/use-boolean'

import { CopyClipboard } from '../CopyClipboard'
import { ConfirmDialog } from '../custom-dialog'

import { User } from '@/types/user'

export const DrawerUser = ({ drawer }: { drawer: SettingsContextProps }) => {
  const theme = useTheme()

  const { data, mutate } = useRequest<Array<User>>({
    url: endpoints.user.getAllUsers,
  })

  const CreateUserSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    permissions: Yup.mixed<'user' | 'admin'>()
      .oneOf(['user', 'admin'], "Permissões devem ser 'user' ou 'admin'")
      .required(),
  })

  const methods = useForm<Pick<User, 'name' | 'permissions'>>({
    defaultValues: {
      name: '',
      permissions: 'user',
    },
    resolver: yupResolver(CreateUserSchema),
  })

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods

  const handleCreateUser = async (userData: Pick<User, 'name' | 'permissions'>) => {
    await axios.post(endpoints.user.createUser, userData).then(() => {
      enqueueSnackbar('Usuário criado com sucesso!', {
        variant: 'success',
        preventDuplicate: true,
      })

      mutate()
    })
  }

  return (
    <Drawer
      anchor="right"
      disablePortal
      open={drawer.open}
      onClose={drawer.onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          ...paper({ theme, bgcolor: theme.palette.background.default }),
          width: 400,
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, pr: 1, pl: 2.5 }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Settings
        </Typography>

        <IconButton onClick={drawer.onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<Iconify icon="mdi:chevron-down" />}
            aria-controls="users-content"
            id="users-content"
          >
            Usuários
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="column" spacing={2}>
              <Alert severity="info">
                Atenção! Os nomes de usuários devem ser identicos aos nomes de usuários do sistema
                GLPI
                <Accordion>
                  <AccordionSummary
                    expandIcon={<Iconify icon="mdi:chevron-down" />}
                    aria-controls="view-users"
                    id="view-users"
                    sx={{ color: theme.palette.action.disabled }}
                  >
                    Ver usuários do GLPI
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack direction="column" spacing={1}>
                      {userNamesStorage.map((name, index) => (
                        <CopyClipboard key={index} value={name} />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Alert>

              <FormProvider
                methods={methods}
                onSubmit={handleSubmit((data) => handleCreateUser(data))}
              >
                <Stack direction="column" spacing={1}>
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <RHFTextField name="name" label="Nome" />

                    <RHFSelect name="permissions" label="Permissões" sx={{ width: 180 }}>
                      {[
                        {
                          label: 'Usuário',
                          value: 'user',
                        },
                        {
                          label: 'Admin',
                          value: 'admin',
                        },
                      ].map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Stack>

                  <Stack justifyContent="flex-end" spacing={1}>
                    <Button type="submit" variant="contained" color="inherit" disabled={!isDirty}>
                      Criar
                    </Button>
                  </Stack>
                </Stack>
              </FormProvider>

              <Divider />

              {data?.map((user) => (
                <UserUpdate key={user._id} user={user} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<Iconify icon="mdi:chevron-down" />}
            aria-controls="sobre-content"
            id="sobre-content"
          >
            Sobre
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Caso precise de ajuda, ou solicitar alguma funcionalidade, entre em contato. <br />{' '}
                <a href="https://web.whatsapp.com/send?1=pt_BR&phone=5549991954455" target="_blank">
                  +55 49 991954455
                </a>{' '}
                <i>~Diego Horvatti</i>
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  )
}

const UserUpdate = ({ user }: { user: User }) => {
  const theme = useTheme()
  const confirmDialog = useBoolean()

  const UpdateUserSchema = Yup.object().shape({
    _id: Yup.string().required(),
    createdAt: Yup.string().required(),
    updatedAt: Yup.string().required(),
    name: Yup.string().required('Name is required'),
    permissions: Yup.mixed<'user' | 'admin'>()
      .oneOf(['user', 'admin'], "Permissions must be 'user' or 'admin'")
      .required(),
  })

  const methods = useForm<User>({
    defaultValues: user,
    resolver: yupResolver(UpdateUserSchema),
  })

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods

  const isActualUser = user.name === userCurrencyStorage

  const handleDelete = async (userId: string) => {
    await axios.delete(endpoints.user.deleteUser(userId)).then(() => {
      enqueueSnackbar('Usuário deletado com sucesso!')

      mutate(endpoints.user.getAllUsers)
    })
  }

  const handleUpdate = async (userId: string, updatedData: User) => {
    await axios.put(endpoints.user.updateUser(userId), updatedData).then(() => {
      enqueueSnackbar('Usuário atualizado com sucesso!')

      if (isActualUser) {
        window.localStorage.setItem('userName', updatedData.name)
      }

      mutate(endpoints.user.getAllUsers)
    })
  }

  return (
    <Paper
      elevation={2}
      sx={{ p: 1, py: 2, backgroundColor: alpha(theme.palette.background.paper, 0.3) }}
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit((data) => handleUpdate(user._id, data))}
      >
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1}>
            <RHFTextField name="name" label="Nome" />

            <RHFSelect name="permissions" label="Permissões" sx={{ width: 180 }}>
              {[
                {
                  label: 'Usuário',
                  value: 'user',
                },
                {
                  label: 'Admin',
                  value: 'admin',
                },
              ].map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={1}>
              {isActualUser && '(atual)'}
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="mdi:delete" />}
                onClick={() => confirmDialog.onTrue()}
              >
                Deletar
              </Button>

              <Button type="submit" variant="contained" color="inherit" disabled={!isDirty}>
                Salvar
              </Button>
            </Stack>
          </Stack>

          {isActualUser && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Como administrador, cuidado ao fazer alteração no seu perfil. Se não ouver outro
                usuário administrador, você poderá perder acesso ao sistema.
              </Typography>
            </Alert>
          )}
        </Stack>
      </FormProvider>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        disablePortal={false}
        content={
          <>
            Você quer mesmo deletar o usuário?
            <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
              <strong> NOTA: </strong> Todos os dados relacionados a este usuário serão deletados.
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(user._id)
              confirmDialog.onFalse()
            }}
          >
            Delete
          </Button>
        }
      />
    </Paper>
  )
}
