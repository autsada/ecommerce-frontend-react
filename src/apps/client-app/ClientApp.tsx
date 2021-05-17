import React, { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import MainNav from '../../components/MainNav'
import ClientNav from './nav/ClientNav'
import NavDropdown from '../../components/NavDropdown'
import ClientDropdown from './nav/ClientDropdown'
import Routes from './Routes'

interface Props {}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!)

const ClientApp: React.FC<Props> = () => {
  const [openDropdown, setOpenDropdown] = useState(false)

  return (
    <Elements stripe={stripePromise}>
      <MainNav>
        <ClientNav setOpenDropdown={setOpenDropdown} />
      </MainNav>

      {openDropdown && (
        <NavDropdown setOpenDropdown={setOpenDropdown}>
          <ClientDropdown setOpenDropdown={setOpenDropdown} />
        </NavDropdown>
      )}

      <div className='page'>
        <Routes />
      </div>
    </Elements>
  )
}

export default ClientApp
