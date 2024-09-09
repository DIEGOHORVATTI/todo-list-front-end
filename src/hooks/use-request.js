'use client'

import { enqueueSnackbar } from 'notistack'
import useSWR from 'swr'

import { axios } from '@/utils/axios'

/**
 * @description Hook to make requests to the API using axios and swr
 * @param {string} url - The url to make the request
 * @param {boolean} silent - If the request should show a snackbar with the response message
 * @param {Method} method - The method to make the request
 */
export function useRequestSWR({
  url = '/set-a-url',
  method = 'GET',
  silent = false,
  stopRequest = false,
  options,
  queryKey,
  ...rest
}) {
  const axiosConfig = {
    method,
    url,
    headers: options?.headers,
    params: options?.params,
    data: options?.data,
  }

  const fetcher = async () => {
    const response = await axios(axiosConfig)
      .then((response) => {
        if (!silent && response.data?.message) {
          enqueueSnackbar(response.data.message, {
            variant: 'success',
            preventDuplicate: true,
          })
        }

        return response
      })
      .catch((error) => {
        const axiosError = error

        if (!silent) {
          enqueueSnackbar(axiosError.message, {
            variant: 'error',
            autoHideDuration: 8000,
            preventDuplicate: true,
          })
        }

        throw axiosError
      })

    return response.data
  }

  const key = stopRequest ? null : queryKey ?? url

  const request = useSWR(key, fetcher, {
    ...rest,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return request
}
