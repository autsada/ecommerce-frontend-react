import React, { useState } from 'react'

import MainNav from '../../components/MainNav'
import AdminNav from './nav/AdminNav'
import NavDropdown from '../../components/NavDropdown'
import AdminDropdown from './nav/AdminDropdown'
import Routes from './Routes'

interface Props {}

const AdminApp: React.FC<Props> = () => {
  const [openDropdown, setOpenDropdown] = useState(false)

  return (
    <div>
      <MainNav>
        <AdminNav setOpenDropdown={setOpenDropdown} />
      </MainNav>

      {openDropdown && (
        <NavDropdown setOpenDropdown={setOpenDropdown}>
          <AdminDropdown setOpenDropdown={setOpenDropdown} />
        </NavDropdown>
      )}

      <div className='page'>
        <Routes />
      </div>
    </div>
  )
}

export default AdminApp
