import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { User } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useDeleteUser = ({
  setOpenDialog,
  setUserToDelete,
}: {
  setOpenDialog: (open: boolean) => void
  setUserToDelete: (user: User | null) => void
}) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<
    { message: string },
    { message: string },
    { userId: string }
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/admin/users/${data.userId}`,
        method: 'DELETE',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.message),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('users')
        alert(data)
        setUserToDelete(null)
        setOpenDialog(false)
      },
    }
  )
}
