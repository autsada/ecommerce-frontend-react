import { useMutation, useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

import { useAppDispatch, useAppSelector } from '../store/store'
import { selectAuth } from '../store/slices/authSlice'
import { setAuth } from '../store/slices/authSlice'
import { createHeaders } from '../utils/helpers'

export const useSignout = (closeDropdown: (close: boolean) => void) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  const history = useHistory()

  return useMutation<{ message: string }, { message: string }>(
    () =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/me/signout`,
        method: 'POST',
        headers: createHeaders('json', accessToken!),
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: () => {
        // Reset auth state
        dispatch(setAuth({ user: undefined, accessToken: undefined }))

        // Invalidate "user" cache
        queryClient.invalidateQueries('user')

        // Close dropdown
        closeDropdown(true)

        // Set localstorage to sync signout for all tabs
        window.localStorage.setItem('signout', Date.now().toString())

        // Push user to homepage
        history.push('/')
      },
    }
  )
}
