import { useQuery } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { OrderDetail } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useOrder = (orderId: string) => {
  const { accessToken } = useAppSelector(selectAuth)

  return useQuery<OrderDetail, { message: string }>(
    ['admin-order', orderId],
    () =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/admin/orders/${orderId}`,
        method: 'GET',
        headers: createHeaders('json', accessToken!),
        withCredentials: true,
      }).then((res) => res.data.order)
  )
}
