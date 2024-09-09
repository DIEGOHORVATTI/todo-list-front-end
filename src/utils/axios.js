import { HOST_API } from '@/constants/config'

import axiosInstance from 'axios'

import { enqueueSnackbar } from 'notistack'

export const serverColorsError = (status) => {
  const statusColor = {
    200: 'success',
    201: 'success',
    202: 'success',
    204: 'success',
    400: 'error',
    401: 'error',
    403: 'error',
    404: 'error',
    409: 'error',
    500: 'error',
    502: 'error',
    503: 'error',
    504: 'error',
  }

  return statusColor[status]
}

export const axios = axiosInstance.create({
  timeout: 60 * 1000, // 1 minute
  timeoutErrorMessage:
    'Tempo limite excedido. Verifique sua conexão com a internet e tente novamente.',
  baseURL: HOST_API,
})

axios.interceptors.response.use(
  (response) => response,
  ({ response }) => {
    const responseAxios = response

    const textDefault = 'Verifique sua conexão com a internet e tente novamente.'

    const message = responseAxios?.data.errors?.map((error = textDefault) => {
      enqueueSnackbar(error, {
        variant: serverColorsError(responseAxios?.status ?? 500),
        preventDuplicate: true,
      })

      return error
    }) || [textDefault]

    // Convert the message array to a single string
    const errorMessage = message.join(', ')
    return Promise.reject(new Error(errorMessage))
  }
)

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args]

  const res = await axiosInstance.get(url, config)

  return res.data
}
