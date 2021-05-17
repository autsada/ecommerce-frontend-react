import React from 'react'
import { NavLink } from 'react-router-dom'

interface Props {
  setOpenDropdown: (open: boolean) => void
}

const AdminDropdown: React.FC<Props> = ({ setOpenDropdown }) => {
  return (
    <div className='sidebar__section sidebar__section--nav'>
      <li className='list'>
        <NavLink
          to='/admin/manage-products'
          className='list-link'
          onClick={() => setOpenDropdown(false)}
        >
          MANAGE PRODUCTS
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to='/admin/manage-orders'
          className='list-link'
          onClick={() => setOpenDropdown(false)}
        >
          MANAGE ORDERS
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to='/admin/manage-users'
          className='list-link'
          onClick={() => setOpenDropdown(false)}
        >
          MANAGE USERS
        </NavLink>
      </li>
    </div>
  )
}

export default AdminDropdown
