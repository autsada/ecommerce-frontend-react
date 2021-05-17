import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { User, Role } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useUpdateUser = (
  id: string,
  setIsEditing: (edit: boolean) => void
) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)

  return useMutation<User, { message: string }, { role: Role }>(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/admin/users/${id}`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        data,
        withCredentials: true,
      }).then((res) => res.data.user),
    {
      onSuccess: (user) => {
        queryClient.invalidateQueries('users')
        queryClient.invalidateQueries(['user', user.id])
        setIsEditing(false)
        alert(`The user: ${user.id} has been updated.`)
      },
    }
  )
}
