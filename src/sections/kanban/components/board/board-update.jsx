'use client'

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import { endpoints } from '@/constants/config'

import { useForm } from 'react-hook-form'

import { RHFTextField } from '@/components/hook-form'
import FormProvider from '@/components/hook-form/form-provider'
import { ConfirmDialog } from '@/components/custom-dialog'

import { axios } from '@/utils/axios'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { enqueueSnackbar } from 'notistack'
import { mutate } from 'swr'

export const UpdateBoard = ({ board, dialogEdit }) => {
  const UpdateUserSchema = Yup.object().shape({
    id: Yup.string().required('Campo obrigatório'),
    name: Yup.string().required('Campo obrigatório'),
    columnIds: Yup.array().required('Campo obrigatório'),
    ordered: Yup.array().required('Campo obrigatório'),
  })

  const methods = useForm({
    defaultValues: board,
    resolver: yupResolver(UpdateUserSchema),
  })

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods

  const handleUpdate = async (boardId, updatedData) =>
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
