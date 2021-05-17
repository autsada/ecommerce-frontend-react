import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import DialogWrapper from '../../../components/DialogWrapper'
import Button from '../../../components/Button'
import { CartItem } from '../../../types'

interface Props {
  header: string
  cartItem: (CartItem & { title: string; image_url: string }) | undefined
  goToCart: () => void
  continueShopping: () => void
}

const ConfirmAddToCartDialog: React.FC<Props> = ({
  header,
  cartItem,
  goToCart,
  continueShopping,
}) => {
  return (
    <DialogWrapper header={header}>
      <div className='dialog-body'>
        <div className='dialog-body__cart-info'>
          <FontAwesomeIcon
            icon={['fas', 'check-circle']}
            size='lg'
            color='green'
          />

          <img src={cartItem?.image_url} alt={cartItem?.title} width='30px' />

          <p className='paragraph'>{cartItem?.title}</p>

          <p className='paragraph'>{cartItem?.quantity}</p>

          <Button onClick={goToCart}>Go to cart</Button>
        </div>

        <Button
          width='13rem'
          className='btn--orange'
          onClick={continueShopping}
        >
          Continue shopping
        </Button>
      </div>
    </DialogWrapper>
  )
}

export default ConfirmAddToCartDialog
