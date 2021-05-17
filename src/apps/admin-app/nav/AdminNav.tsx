import React, { Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  setOpenDropdown: Dispatch<SetStateAction<boolean>>
}

const AdminNav: React.FC<Props> = ({ setOpenDropdown }) => {
  return (
    <ul className='navbar'>
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

export default AdminNav
