import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { createHeaders } from '../../../utils/helpers'

export const useSetDefaultCard = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    { message: string },
    { message: string },
    { paymentMethodId: string }
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/checkout/set-default-card`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards')
      },
    }
  )
}
