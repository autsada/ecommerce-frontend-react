import { useQuery } from 'react-query'
import axios from 'axios'
import { PaymentMethod } from '@stripe/stripe-js'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { StripeCustomer } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useCards = () => {
  const { accessToken } = useAppSelector(selectAuth)

  return useQuery<
    { paymentMethods: PaymentMethod[]; customer: StripeCustomer },
    { message: string }
  >('cards', () =>
    axios({
      url: `${process.env.REACT_APP_BACKEND_URI!}/checkout/list-cards`,
      method: 'GET',
      headers: createHeaders('json', accessToken!),
      withCredentials: true,
    }).then((res) => res.data)
  )
}
