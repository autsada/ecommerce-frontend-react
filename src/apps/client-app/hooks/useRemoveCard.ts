import { useMutation, useQueryClient } from 'react-query'
import { PaymentMethod } from '@stripe/stripe-js'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { createHeaders } from '../../../utils/helpers'

export const useRemoveCard = ({
  setCardToRemove,
  setOpenDialog,
}: {
  setCardToRemove: (method: PaymentMethod | null) => void
  setOpenDialog: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    { message: string },
    { message: string },
    { paymentMethodId: string }
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/checkout/remove-card`,
        method: 'DELETE',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards')
        setCardToRemove(null)
        setOpenDialog(false)
      },
    }
  )
}
