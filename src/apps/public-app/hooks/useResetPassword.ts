import { useMutation } from 'react-query'
import axios from 'axios'

import { SignupData } from '../../../types'

export const useRestPassword = () => {
  return useMutation<
    { message: string },
    { message: string },
    Pick<SignupData, 'email'>
  >((data) =>
    axios({
      url: `${process.env.REACT_APP_BACKEND_URI!}/auth/reset-password`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      data,
      withCredentials: true,
    }).then((res) => res.data)
  )
}
