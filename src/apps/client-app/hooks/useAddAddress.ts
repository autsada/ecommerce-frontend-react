import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Address } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useAddAddress = (resetForm: () => void) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    Address,
    { message: string },
    Pick<
      Address,
      'fullname' | 'address1' | 'address2' | 'city' | 'zip_code' | 'phone'
    >
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/addresses`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.shipping_address),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('addresses')
        resetForm()
      },
    }
  )
}
