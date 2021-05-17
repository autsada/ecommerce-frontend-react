import React, { Dispatch, SetStateAction } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { calculateCartQuantity } from '../../../utils/helpers'
import { useCart } from '../hooks/useCart'

interface Props {
  setOpenDropdown: Dispatch<SetStateAction<boolean>>
}

const ClientNav: React.FC<Props> = ({ setOpenDropdown }) => {
  const { data: cart } = useCart()

  return (
    <ul className='navbar'>
      <div className='navbar__lists'>
        <li className='list list--cart'>
          <NavLink to='/my-cart'>
            <FontAwesomeIcon
              icon={['fas', 'cart-arrow-down']}
              color='white'
              size='lg'
            />
          </NavLink>
          <div className='cart-qty'>
            {!cart ? 0 : calculateCartQuantity(cart.items)}
          </div>
        </li>
      </div>

      <div className='navbar__profile'>
        <div className='profile'>
          <FontAwesomeIcon
            icon={['fas', 'user-circle']}
            color='white'
            size='2x'
            onClick={() => setOpenDropdown((prev) => !prev)}
          />
        </div>
      </div>
    </ul>
  )
}

export default ClientNav
