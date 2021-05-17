import React, { Dispatch, SetStateAction } from 'react'

import Button from './Button'
import { useAppSelector } from '../store/store'
import { selectAuth } from '../store/slices/authSlice'
import { useSignout } from '../hooks/useSignout'
import { User } from '../types'

interface Props {
  setOpenDropdown: Dispatch<SetStateAction<boolean>>
}

const NavDropdown: React.FC<Props> = ({ setOpenDropdown, children }) => {
  const { mutate: signout, isLoading } = useSignout(setOpenDropdown)
  const { user } = useAppSelector(selectAuth)

  return (
    <div className='page page--sidebar'>
      <div className='sidebar sidebar-show'>
        <div className='sidebar__section sidebar__section--profile'>
          <h3 className='header--center header--sidebar'>{user?.username}</h3>
          <h3 className='header--center header--sidebar'>{user?.email}</h3>
        </div>

        {/* Detail here depending on the role of user */}
        <>{children}</>

        {/* Logout */}
        <div className='sidebar__section'>
          <Button
            className='btn--sidebar-signout'
            disabled={isLoading}
            loading={isLoading}
            onClick={() => signout()}
          >
            SIGN OUT
          </Button>
        </div>

        {/* Close sidebar */}
        <div className='sidebar__section'>
          <Button
            className='sidebar__close'
            onClick={() => setOpenDropdown(false)}
          >
            &times;
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NavDropdown
