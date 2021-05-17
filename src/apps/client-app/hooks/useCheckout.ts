import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { createHeaders } from '../../../utils/helpers'

export const useCheckout = (setClientSecret: (secrete: string) => void) =>
  // setPaymentIntent: (data: {
  //   payment_intent_id: string
  //   client_secret: string
  // }) => void
  {
    const queryClient = useQueryClient()
    const { accessToken } = useAppSelector(selectAuth)

    return useMutation<
      { payment_intent_id: string; client_secret: string },
      { message: string }
      // { amount: number; cartId: string }
    >(
      () =>
        axios({
          url: `${process.env.REACT_APP_BACKEND_URI!}/checkout`,
          method: 'POST',
          headers: createHeaders('json', accessToken || ''),
          // data,
          withCredentials: true,
        }).then((res) => res.data),
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries('cart')
          setClientSecret(response.client_secret)
        },
      }
    )
  }
