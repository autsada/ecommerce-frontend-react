import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../../../components/Button'

interface Props {}

const SocialMediaLogin: React.FC<Props> = () => {
  return (
    <div className='social'>
      <Button className='social-btn social-btn--fb' width='100%' height='3rem'>
        <FontAwesomeIcon icon={['fab', 'facebook-f']} size='1x' />
        <span>Log in with Facebook</span>
      </Button>
      <Button
        className='social-btn social-btn--google'
        width='100%'
        height='3rem'
      >
        <FontAwesomeIcon icon={['fab', 'google']} size='1x' />
        <span>Log in with Google</span>
      </Button>
    </div>
  )
}

export default SocialMediaLogin
