import { useQuery } from 'react-query'
import axios from 'axios'

import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { User } from '../../../types'
import { createHeaders } from '../../../utils/helpers'

export const useUsers = (page: number = 0, perPage: number) => {
  const { accessToken } = useAppSelector(selectAuth)

  return useQuery<
    { users: User[]; totalQueries: number; hasMore: boolean },
    { message: string }
  >(
    ['users', page, perPage],
    () =>
      axios({
        url: `${process.env
          .REACT_APP_BACKEND_URI!}/admin/users/?q=${page}&l=${perPage}`,
        method: 'GET',
        headers: createHeaders('json', accessToken!),
        withCredentials: true,
      }).then((res) => res.data),
    { keepPreviousData: true, staleTime: 1000 * 60 * 10 }
  )
}
