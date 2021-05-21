import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppDispatch } from '../../../store/store'
import { setAuth } from '../../../store/slices/authSlice'
import { setModal } from '../../../store/slices/modalSlice'
import { User, SignupData } from '../../../types'

export const useSignUp = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation<
    { message: string; accessToken: string; user: User },
    { message: string },
    SignupData
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/auth/signup`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        data,
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: (res) => {
        dispatch(setAuth(res))
        queryClient.invalidateQueries('cart')
        dispatch(setModal('close'))
      },
    }
  )
}
