import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { Address } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useDeleteAddress = ({
  setOpenDialog,
  setAddressToDelete,
}: {
  setOpenDialog: (open: boolean) => void
  setAddressToDelete: (address: Address | undefined) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<string, { message: string }, { id: string }>(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/addresses/${data.id}`,
        method: 'DELETE',
        headers: createHeaders('json', accessToken!),
        withCredentials: true,
      }).then((res) => res.data.message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('addresses')
        setOpenDialog(false)
        setAddressToDelete(undefined)
      },
    }
  )
}
