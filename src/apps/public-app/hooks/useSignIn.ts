import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { useAppDispatch } from '../../../store/store'
import { setAuth } from '../../../store/slices/authSlice'
import { setModal } from '../../../store/slices/modalSlice'
import { User, SignupData } from '../../../types'

export const useSignIn = () => {
  const queryClient = useQueryClient()
  const disPatch = useAppDispatch()

  return useMutation<
    { message: string; accessToken: string; user: User },
    { message: string },
    Omit<SignupData, 'username'>
  >(
    (data) =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/auth/signin`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        data,
        withCredentials: true,
      }).then((res) => res.data),
    {
      onSuccess: (res) => {
        disPatch(setAuth(res))
        queryClient.invalidateQueries('cart')
        disPatch(setModal('close'))
      },
    }
  )
}
