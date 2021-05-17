import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Address } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useUpdateAddress = ({
  resetForm,
  setAddressToEdit,
}: {
  resetForm: () => void
  setAddressToEdit: (address: Address | undefined) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    Address,
    { message: string },
    Omit<Address, 'owner_id' | 'created_at' | 'updated_at'>
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/addresses/${data.id}`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.shipping_address),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('addresses')
        resetForm()
        setAddressToEdit(undefined)
      },
    }
  )
}
