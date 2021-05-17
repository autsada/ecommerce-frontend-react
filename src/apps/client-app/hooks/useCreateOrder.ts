import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Order } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useCreateOrder = ({
  setProcessing,
  setSucceeded,
}: {
  setSucceeded: (success: boolean) => void
  setProcessing: (processing: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    Order,
    { message: string },
    {
      paymentId: string
      paymentStatus: string
    }
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/orders`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.order),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders')
        // queryClient.invalidateQueries('admin-orders')
        queryClient.invalidateQueries('cart')
        queryClient.invalidateQueries('products')
        setProcessing(false)
        setSucceeded(true)
      },
    }
  )
}
