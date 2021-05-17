import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Spinner from '../../../components/Spinner'
import { useUpdateCart } from '../hooks/useUpdateCart'
import { CartItemDetail } from '../../../types'
import { formatAmount } from '../../../utils/helpers'

interface Props {
  cartItem: CartItemDetail
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
  setCartItemToDelete: (item: CartItemDetail | undefined) => void
}

const MyCartItem: React.FC<Props> = ({
  cartItem,
  openDialog,
  setOpenDialog,
  setCartItemToDelete,
}) => {
  const { id, quantity, title, description, price, image_url, inventory } =
    cartItem

  const [updatedQuantity, setUpdatedQuantity] = useState(0)
  const { mutate: updateCart, isLoading } = useUpdateCart({
    setOpenDialog,
    setUpdatedQuantity,
  })

  useEffect(() => {
    if (!openDialog) {
      if (updatedQuantity + quantity === 0) setUpdatedQuantity(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog])

  const handleUpdateCart = () => {
    if (updatedQuantity === 0) return

    if (updatedQuantity + quantity === 0) {
      setCartItemToDelete(cartItem)
      setOpenDialog(true)
      // setUpdatedQuantity(0)
      return
    }

    return updateCart({
      quantity: updatedQuantity,
      cartItemId: id,
    })
  }

  return (
    <div className='cart-item'>
      <img src={image_url} alt={title} className='cart-item__img' />

      <div className='cart-item__detail'>
        <h4 className='header'>{title}</h4>

        <p className='paragraph paragraph--focus'>{description}</p>

        <p className='paragraph'>
          Price:{' '}
          <span className='paragraph--orange paragraph--focus'>
            ${formatAmount(price)}
          </span>
        </p>

        <div className='cart-item__update-qty'>
          <div className='quantity-control'>
            <div
              className='qty-action'
              style={{
                cursor:
                  updatedQuantity + quantity === 0 ? 'not-allowed' : undefined,
              }}
              onClick={() =>
                setUpdatedQuantity((prev) => {
                  if (prev + quantity === 0) return prev

                  return prev - 1
                })
              }
            >
              <FontAwesomeIcon icon={['fas', 'minus']} size='xs' color='red' />
            </div>

            <div className='qty-action'>{quantity + updatedQuantity}</div>

            <div
              className='qty-action'
              style={{
                cursor:
                  updatedQuantity + quantity === inventory
                    ? 'not-allowed'
                    : undefined,
              }}
              onClick={() =>
                setUpdatedQuantity((prev) => {
                  if (prev + quantity === inventory) return prev
                  return prev + 1
                })
              }
            >
              <FontAwesomeIcon
                icon={['fas', 'plus']}
                size='xs'
                color='#282c34'
              />
            </div>
          </div>

          {updatedQuantity !== 0 && (
            <div className='quantity-update-action'>
              {isLoading ? (
                <Spinner color='grey' />
              ) : (
                <p
                  className='paragraph paragraph--success paragraph--focus'
                  style={{ cursor: 'pointer' }}
                  onClick={handleUpdateCart}
                >
                  Confirm
                </p>
              )}
              <p
                className='paragraph paragraph--error paragraph--focus'
                style={{ cursor: 'pointer' }}
                onClick={() => setUpdatedQuantity(0)}
              >
                Cancel
              </p>
            </div>
          )}
        </div>

        <p
          className='paragraph paragraph--error paragraph--focus'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCartItemToDelete(cartItem)
            setOpenDialog(true)
          }}
        >
          Remove
        </p>
      </div>

      <div className='cart-item__amount'>
        <h4 className='header'>Amount</h4>
        <p className='paragraph paragraph--focus paragraph-bold'>
          ${formatAmount((quantity + updatedQuantity) * price)}
        </p>
      </div>
    </div>
  )
}

export default MyCartItem
