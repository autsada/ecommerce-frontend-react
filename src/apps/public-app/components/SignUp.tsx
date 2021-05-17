import React from 'react'
import { useForm } from 'react-hook-form'

import Button from '../../../components/Button'
import Input from '../../../components/Input'
import SocialMediaLogin from './SocialMediaLogin'
import { useAppDispatch } from '../../../store/store'
import { setModal } from '../../../store/slices/modalSlice'
import { useSignUp } from '../hooks/useSignUp'
import { SignupData } from '../../../types'

interface Props {}

const SignUp: React.FC<Props> = () => {
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>()
  const { mutate: signup, isLoading, error } = useSignUp()

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

        <h3 className='header--center paragraph--orange'>
          Sign up to AwesomeShop
        </h3>

        <SocialMediaLogin />

        <hr></hr>
        <p className='paragraph--center paragraph--focus paragraph--small'>
          Or sign up with an email
        </p>

        <form className='form' onSubmit={handleSubmit((data) => signup(data))}>
          <Input
            label='Username'
            placeholder='Your username'
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required.',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters.',
              },
              maxLength: {
                value: 20,
                message: 'Username must not be greater thant 20 characters.',
              },
            })}
          />

          <Input
            label='Email'
            placeholder='Your email'
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email is in wrong format.',
              },
            })}
          />

          <Input
            type='password'
            label='Password'
            placeholder='Your password'
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required.',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters.',
              },
              maxLength: {
                value: 50,
                message: 'Password must not be greater thant 50 characters.',
              },
            })}
          />

          <Button
            width='100%'
            style={{ margin: '0.5rem 0' }}
            disabled={isLoading}
            loading={isLoading}
          >
            Submit
          </Button>

          {error && (
            <p className='paragraph paragraph--error'>{error.message}</p>
          )}
        </form>

        <p className='paragraph paragraph--focus paragraph--small'>
          Already have an account?{' '}
          <span
            className='paragraph--orange paragraph--link'
            onClick={() => dispatch(setModal('signin'))}
          >
            sign in
          </span>{' '}
          instead.
        </p>
      </div>
    </>
  )
}

export default SignUp
