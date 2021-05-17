import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Product } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useAddProduct = (setOpenProductForm: (open: boolean) => void) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<Product, { message: string }, FormData>(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/admin/products`,
        method: 'POST',
        headers: createHeaders('form-data', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products')
        setOpenProductForm(false)
      },
    }
  )
}
