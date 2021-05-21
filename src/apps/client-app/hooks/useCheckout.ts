import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { createHeaders } from '../../../utils/helpers'

export const useCheckout = (setClientSecret: (secret: string) => void) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    { payment_intent_id: string; client_secret: string },
    { message: string }
  >(
    () =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/checkout`,
        method: 'POST',
        headers: createHeaders('json', accessToken || ''),
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('cart')
        setClientSecret(response.client_secret)
      },
      retry: 3, // Retry on error (3 times)
    }
  )
}
