import axios from 'axios'
import { useQuery } from 'react-query'

import { useAppSelector, useAppDispatch } from '../store/store'
import { setAuth } from '../store/slices/authSlice'
import { User } from '../types'
import { createHeaders } from '../utils/helpers'

export const useAuth = () => {
  const { accessToken } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  return useQuery<{ user: User; accessToken: string }, { message: string }>(
    'user',
    () =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/me`,
        method: 'GET',
        headers: createHeaders('json', accessToken!),
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: (res) => {
        dispatch(setAuth(res))
      },
      onError: () => {
        dispatch(setAuth({ user: undefined, accessToken: undefined }))
      },
      refetchInterval: 1000 * 60 * 5, // 5 mins
    }
  )
}
