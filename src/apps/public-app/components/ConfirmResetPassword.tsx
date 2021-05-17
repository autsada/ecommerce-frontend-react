import React from 'react'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { useAppDispatch } from '../../../store/store'
import { setModal } from '../../../store/slices/modalSlice'
import { useConfirmRestPassword } from '../hooks/useConfirmResetPassword'
import { SignupData } from '../../../types'

interface Props {
  resetToken: string
}

const ConfirmResetPassword: React.FC<Props> = ({ resetToken }) => {
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Pick<SignupData, 'password'>>()
  const {
    mutate: confirmResetPassword,
    isLoading,
    error,
    isSuccess,
  } = useConfirmRestPassword()

  const history = useHistory()

  return (
    <div className='modal modal--auth-form'>
      <h5 className='header--center paragraph--orange'>
        Please enter your new password below.
      </h5>

      <form
        className='form'
        onSubmit={handleSubmit((data) =>
          confirmResetPassword({
            password: data.password,
            resetPasswordToken: resetToken,
          })
        )}
      >
        <Input
          type='password'
          placeholder='New password'
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required.',
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

        {error && <p className='paragraph paragraph--error'>{error.message}</p>}
      </form>

      {isSuccess && (
        <p className='paragraph--success paragraph--small'>
          You can now{' '}
          <span
            className='paragraph--orange paragraph--link'
            onClick={() => {
              history.push('/')
              dispatch(setModal('signin'))
            }}
          >
            sign in
          </span>{' '}
        </p>
      )}
    </div>
  )
}

export default ConfirmResetPassword
