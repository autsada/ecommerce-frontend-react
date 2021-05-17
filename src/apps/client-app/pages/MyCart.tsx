import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import MyCartItem from '../components/MyCartItem'
import Spinner from '../../../components/Spinner'
import Button from '../../../components/Button'
import AlertDialog from '../../../components/AlertDialog'
import { useCart } from '../hooks/useCart'
import { useDeleteCartItem } from '../hooks/useDeleteCartItem'
import { CartItemDetail } from '../../../types'
import {
  calculateCartQuantity,
  calculateCartAmount,
  formatAmount,
} from '../../../utils/helpers'

interface Props {}

const MyCart: React.FC<Props> = () => {
  const [cartItemToDelete, setCartItemToDelete] =
    useState<CartItemDetail | undefined>(undefined)

  const [openDialog, setOpenDialog] = useState(false)
  const { data: cart, isLoading } = useCart()
  const {
    mutate: deleteCartItem,
    isLoading: loading,
    error,
  } = useDeleteCartItem({ setOpenDialog, setCartItemToDelete })

  const history = useHistory()

  const handleDeleteCart = () => {
    if (!cartItemToDelete) return

    return deleteCartItem({ cartItemId: cartItemToDelete.id })
  }

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  if (!cart?.items || cart.items.length === 0)
    return (
      <h2 className='header--center'>
        Your cart is empty, start{' '}
        <span
          className='header--orange header--link'
          onClick={() => history.push('/')}
        >
          shopping?
        </span>
      </h2>
    )

  return (
    <div className='page--my-cart'>
      <div className='cart'>
        <h2 className='header'>Shopping cart</h2>

        <div className='cart-detail'>
          {cart.items.map((item) => (
            <MyCartItem
              key={item.id}
              cartItem={item}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              setCartItemToDelete={setCartItemToDelete}
            />
          ))}
        </div>
      </div>

      <div className='cart-summary'>
        <h3 className='header'>Cart summary:</h3>

        <div>
          <p className='paragraph'>
            Quantity:{' '}
            <span className='paragraph paragraph--orange paragraph--focus'>
              {calculateCartQuantity(cart.items)}
            </span>
          </p>

          <p className='paragraph'>
            Amount:{' '}
            <span className='paragraph paragraph--orange paragraph--focus'>
              ${formatAmount(calculateCartAmount(cart.items))}
            </span>
          </p>
        </div>

        <Button
          width='100%'
          className='btn--orange'
          style={{ margin: '1rem 0' }}
          onClick={() => history.push('/payment/shipping-addresses')}
        >
          Proceed to checkout
        </Button>
      </div>

      {openDialog && cartItemToDelete && (
        <AlertDialog
          header='Please confirm'
          message={`Are you sure you want to delete the "${cartItemToDelete.title}" from your cart?`}
          onCancel={() => {
            setCartItemToDelete(undefined)
            setOpenDialog(false)
          }}
          onConfirm={handleDeleteCart}
          loading={loading}
          error={error?.message}
        />
      )}
    </div>
  )
}

export default MyCart
