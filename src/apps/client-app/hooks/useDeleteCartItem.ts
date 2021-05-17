import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { CartItemDetail } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useDeleteCartItem = ({
  setOpenDialog,
  setCartItemToDelete,
}: {
  setOpenDialog: (open: boolean) => void
  setCartItemToDelete: (item: CartItemDetail | undefined) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    { message: string },
    { message: string },
    { cartItemId: string }
  >(
    ({ cartItemId }) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/cart/${cartItemId}`,
        method: 'DELETE',
        headers: createHeaders('json', accessToken!),
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart')
        setOpenDialog(true)
        setCartItemToDelete(undefined)
      },
    }
  )
}
