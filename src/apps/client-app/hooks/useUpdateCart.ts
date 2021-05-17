import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { CartItem } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useUpdateCart = ({
  setOpenDialog,
  setUpdatedQuantity,
}: {
  setOpenDialog: (open: boolean) => void
  setUpdatedQuantity: (qty: number) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    CartItem,
    { message: string },
    { quantity: number; cartItemId: string }
  >(
    ({ quantity, cartItemId }) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/cart/${cartItemId}`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data: { quantity },
        withCredentials: true,
      }).then((res) => res.data.cartItem),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('cart')
        queryClient.invalidateQueries(['product', res.product_id])
        setOpenDialog(true)
        setUpdatedQuantity(0)
      },
    }
  )
}
