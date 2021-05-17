import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Product } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useDeleteProduct = ({
  setOpenDialog,
  setProductToDelete,
}: {
  setOpenDialog: (open: boolean) => void
  setProductToDelete: (product: Product | undefined) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    { message: string },
    { message: string },
    { productId: string }
  >(
    ({ productId }) =>
      axios({
        url: `${process.env
          .REACT_APP_BACKEND_URI!}/admin/products/${productId}`,
        method: 'DELETE',
        headers: createHeaders('json', accessToken!),
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products')
        setOpenDialog(false)
        setProductToDelete(undefined)
      },
    }
  )
}
