import { HOST_API, userCurrencyStorage } from '@/constants/config'

import axiosInstance, { AxiosResponse, AxiosRequestConfig } from 'axios'

import { SharedProps, enqueueSnackbar } from 'notistack'

export type ErrorObjAxios = {
  message: string
  status: number
}

type ServerColors = { [key: number]: SharedProps['variant'] }

type ErrorAPI = {
  errors: Array<string>
}

export const serverColorsError = (status: number) => {
  const statusColor: ServerColors = {
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
    const responseAxios = response as AxiosResponse<ErrorAPI> | undefined

    const textDefault = 'Verifique sua conexão com a internet e tente novamente.'

    const message = responseAxios?.data.errors?.map((error: string = textDefault) => {
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

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args]

  const params = { ...(config?.params || {}), ...{ user: userCurrencyStorage } }

  const res = await axiosInstance.get(url, { ...config, params })

  return res.data
}
