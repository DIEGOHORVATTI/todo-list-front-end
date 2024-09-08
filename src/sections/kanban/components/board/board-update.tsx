'use client'

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import { endpoints } from '@/constants/config'

import { useForm } from 'react-hook-form'

import { RHFAutocomplete, RHFTextField } from '@/components/hook-form'
import FormProvider from '@/components/hook-form/form-provider'
import { ConfirmDialog } from '@/components/custom-dialog'

import { axios } from '@/utils/axios'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { enqueueSnackbar } from 'notistack'
import { IKanbanBoard } from '@/types/kanban'
import { mutate } from 'swr'
import { useRequest } from '@/hooks/use-request'
import { User } from '@/types/user'

type Props = {
  board: IKanbanBoard
  dialogEdit: any
}

export const UpdateBoard = ({ board, dialogEdit }: Props) => {
  const { data: users } = useRequest<Array<User>>({
    url: endpoints.user.getAllUsers,
  })

  const UpdateUserSchema = Yup.object().shape({
    id: Yup.string().required('Campo obrigatório'),
    name: Yup.string().required('Campo obrigatório'),
    usersIds: Yup.array().required('Campo obrigatório'),
    columnIds: Yup.array().required('Campo obrigatório'),
    ordered: Yup.array().required('Campo obrigatório'),
  })

  const methods = useForm<IKanbanBoard>({
    defaultValues: board,
    resolver: yupResolver(UpdateUserSchema),
  })

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods

  const handleUpdate = async (boardId: string, updatedData: IKanbanBoard) =>
    await axios.put(endpoints.boards.updateBoard(boardId), updatedData).then(() => {
      enqueueSnackbar('Quadro atualizado com sucesso')

      mutate(endpoints.boards.getAllBoards)
      dialogEdit.onFalse()
    })

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit((data) => handleUpdate(board.id, data))}>
      <ConfirmDialog
        open={dialogEdit.value}
        onClose={dialogEdit.onFalse}
        title="Editar Quadro"
        content={
          <Stack direction="column" spacing={2} py={1}>
            <RHFTextField name="name" label="Nome" />

            <RHFAutocomplete
              multiple
              name="usersIds"
              label="Usuários"
              options={users?.map((user) => ({ value: user._id, label: user.name }))}
            />
          </Stack>
        }
        action={
          <Button type="submit" variant="contained" color="inherit" disabled={!isDirty}>
            Salvar
          </Button>
        }
      />
    </FormProvider>
  )
}
