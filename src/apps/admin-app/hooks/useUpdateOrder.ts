import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Order, ShipmentStatus } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useUpdateOrder = (orderId: string) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    Order,
    { message: string },
    { shipmentStatus: ShipmentStatus }
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/admin/orders/${orderId}`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.order),
    {
      onSuccess: (order) => {
        queryClient.invalidateQueries('admin-orders')
        queryClient.invalidateQueries(['admin-order', order.id])
        alert(`The order: ${order.id} has been updated.`)
      },
    }
  )
}
