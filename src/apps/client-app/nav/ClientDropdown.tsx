import React from 'react'
import { NavLink } from 'react-router-dom'

interface Props {
  setOpenDropdown: (open: boolean) => void
}

const ClientDropdown: React.FC<Props> = ({ setOpenDropdown }) => {
  return (
    <div className='sidebar__section sidebar__section--nav'>
      <li className='list'>
        <NavLink
          to='/products'
          className='list-link'
          onClick={() => setOpenDropdown(false)}
        >
          PRODUCTS
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to='/my-cart'
          className='list-link'
          onClick={() => setOpenDropdown(false)}
        >
          MY CART
        </NavLink>
      </li>
      <li className='list'>
        <NavLink
          to='/my-orders'
          className='list-link'
          onClick={() => setOpenDropdown(false)}
        >
          MY ORDERS
        </NavLink>
      </li>
    </div>
  )
}

export default ClientDropdown
