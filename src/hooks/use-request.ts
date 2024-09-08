'use client'

import { axios } from '@/utils/axios'
import { AxiosError, AxiosRequestConfig, Method } from 'axios'

import { enqueueSnackbar } from 'notistack'

import useSWR, { SWRConfiguration } from 'swr'

type HookOptions = {
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: Record<string, any>
}

export interface ResponseWithMessage {
  errors?: []
}

export type Error<T> = AxiosError<T, { message: string; status: number }>

export type UseRequestProps = SWRConfiguration & {
  url: string
  queryKey?: string
  silent?: boolean
  stopRequest?: boolean
  method?: Method
  options?: HookOptions
}

/**
 * @description Hook to make requests to the API using axios and swr
 * @param {string} url - The url to make the request
 * @param {boolean} silent - If the request should show a snackbar with the response message
 * @param {Method} method - The method to make the request
 */
export function useRequest<T>({
  url,
  method = 'GET',
  silent = false,
  stopRequest = false,
  options,
  queryKey,
  ...rest
}: UseRequestProps) {
  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    headers: options?.headers,
    params: options?.params,
    data: options?.data,
  }

  const fetcher = async () => {
    try {
      const response = stopRequest ? { data: {} } : await axios(axiosConfig)

      if (!silent && response.data?.message) {
        enqueueSnackbar(response.data.message, {
          variant: 'success',
          preventDuplicate: true,
        })
      }

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<T>

      if (!silent) {
        enqueueSnackbar(axiosError.message, {
          variant: 'error',
          autoHideDuration: 8000,
          preventDuplicate: true,
        })
      }

      throw axiosError
    }
  }

  const request = useSWR<T, Error<T>>(url, fetcher, {
    ...rest,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return request
}
