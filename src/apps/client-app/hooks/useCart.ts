import { useQuery } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { CartDetail } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useCart = () => {
  const { accessToken } = useAppSelector(selectAuth)

  return useQuery<CartDetail, { message: string }>('cart', () =>
    axios({
      url: `${process.env.REACT_APP_BACKEND_URI!}/cart`,
      method: 'GET',
      headers: createHeaders('json', accessToken!),
      withCredentials: true,
    }).then((res) => res.data.cart)
  )
}
