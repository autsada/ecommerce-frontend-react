import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import MainNav from '../../components/MainNav'
import PublicNav from './nav/PublicNav'
import Routes from './Routes'
import SignUp from '../../apps/public-app/components/SignUp'
import SignIn from '../../apps/public-app/components/SignIn'
import ResetPassword from '../../apps/public-app/components/ResetPassword'
import ConfirmResetPassword from './components/ConfirmResetPassword'
import { useAppSelector } from '../../store/store'
import { selectModal } from '../../store/slices/modalSlice'

interface Props {}

const PuplicApp: React.FC<Props> = () => {
  const modal = useAppSelector(selectModal)

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const queryString = params.get('resetToken')

  useEffect(() => {
    if (queryString) {
    }
  }, [queryString])

  return (
    <div>
      <MainNav>
        <PublicNav />
      </MainNav>
      <div className='page'>
        <Routes />
      </div>

      {queryString ? (
        <ConfirmResetPassword resetToken={queryString} />
      ) : modal === 'signup' ? (
        <SignUp />
      ) : modal === 'signin' ? (
        <SignIn />
      ) : modal === 'request_reset_password' ? (
        <ResetPassword />
      ) : null}
    </div>
  )
}

export default PuplicApp
