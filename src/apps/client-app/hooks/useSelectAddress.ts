import { useMutation, useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Cart } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useSelectAddress = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  const history = useHistory()

  return useMutation<Cart, { message: string }, { addressId: string }>(
    ({ addressId }) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/checkout/select-address`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data: { addressId },
        withCredentials: true,
      }).then((res) => res.data.cart),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('cart')

        history.push({
          pathname: '/payment/checkout',
        })
      },
    }
  )
}
