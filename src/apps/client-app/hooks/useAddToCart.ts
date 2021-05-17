import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { CartItem } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useAddToCart = (setOpenDialog: (open: boolean) => void) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    CartItem,
    { message: string },
    { quantity: number; productId: string }
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/cart`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.cartItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart')
        setOpenDialog(true)
      },
    }
  )
}
