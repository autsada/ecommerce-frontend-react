import React from 'react'
import { useForm } from 'react-hook-form'

import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { useAppDispatch } from '../../../store/store'
import { setModal } from '../../../store/slices/modalSlice'
import { useRestPassword } from '../hooks/useResetPassword'
import { SignupData } from '../../../types'

interface Props {}

const ResetPassword: React.FC<Props> = () => {
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Pick<SignupData, 'email'>>()
  const {
    mutate: resetPassword,
    isLoading,
    error,
    data,
    isSuccess,
  } = useRestPassword()

  return (
    <>
      <div className='backdrop' onClick={() => dispatch(setModal('close'))}>
        {' '}
      </div>

      <div className='modal modal--auth-form'>
        <div
          className='modal-close'
          onClick={() => dispatch(setModal('close'))}
        >
          &times;
        </div>
        <h5 className='header--center paragraph--orange'>
          Enter your email below to reset your password.
        </h5>
        <form
          className='form'
          onSubmit={handleSubmit((data) => resetPassword(data))}
        >
          <Input
            placeholder='Your email'
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
              // pattern: {
              //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              //   message: 'Email is in wrong format.',
              // },
            })}
          />

          <Button
            width='100%'
            style={{ margin: '0.5rem 0' }}
            disabled={isLoading || isSuccess}
            loading={isLoading}
          >
            Submit
          </Button>

          {error && (
            <p className='paragraph paragraph--error'>{error.message}</p>
          )}
        </form>

        {data && (
          <p className='paragraph--success paragraph--small'>{data.message}</p>
        )}
      </div>
    </>
  )
}

export default ResetPassword
