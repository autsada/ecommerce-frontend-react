import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../components/Button'
import Spinner from '../components/Spinner'
import ConfirmAddToCartDialog from '../apps/client-app/components/ConfirmAddToCartDialog'
import PageNotFound from './NotFound'
import { useProduct } from '../hooks/useProduct'
import { useAppSelector, useAppDispatch } from '../store/store'
import { selectAuth } from '../store/slices/authSlice'
import { setModal } from '../store/slices/modalSlice'
import { useCart } from '../apps/client-app/hooks/useCart'
import { useAddToCart } from '../apps/client-app/hooks/useAddToCart'
import { CartItemDetail } from '../types'
import { formatAmount } from '../utils/helpers'

interface Props {}

const ProductDetail: React.FC<Props> = () => {
  const [quantity, setQuantity] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [existingCartItem, setExistingCartItem] =
    useState<CartItemDetail | undefined>(undefined)

  const { user } = useAppSelector(selectAuth)

  const { data: cart } = useCart()

  const dispatch = useAppDispatch()

  const params = useParams() as { productId: string }
  const history = useHistory()

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useProduct(params.productId)
  const {
    mutate: addToCart,
    isLoading: addToCartLoading,
    error: addToCartError,
    isSuccess,
    data: addedCartItem,
  } = useAddToCart(setOpenDialog)

  useEffect(() => {
    refetch()
  }, [params.productId, refetch])

  useEffect(() => {
    if (error) alert(error.message)
  }, [error])

  useEffect(() => {
    if (cart) {
      const exist = cart.items?.find(
        (item) => item.id === params.productId
        // (item) => item.productId === params.productId
      )

      if (exist) setExistingCartItem(exist)
    }
  }, [cart, params.productId])

  useEffect(() => {
    if (addToCartError) alert(addToCartError.message)
  }, [addToCartError])

  const handleAddToCart = () => {
    if (!user) {
      dispatch(setModal('signin'))
      return
    }

    if (!product) return

    if (product.inventory === 0) return

    return addToCart({
      quantity,
      productId: product.id,
    })
  }

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  if (!product) return <PageNotFound />

  return (
    <div className='page--product-detail'>
      <div className='product-detail__section'>
        <img
          src={product.image_url}
          alt={product.title}
          className='product-image'
        />
      </div>

      <div className='product-detail__section'>
        <div className='product-detail__sub-section'>
          <h3 className='header'>{product.title}</h3>
          <p className='paragraph'>{product.description}</p>
        </div>

        <div className='product-detail__sub-section'>
          <p className='paragraph'>
            Price:{' '}
            <span className='paragraph--orange'>
              ${formatAmount(product.price)}
            </span>
          </p>
        </div>

        <div className='product-detail__sub-section product-detail__sub-section--stock'>
          <p className='paragraph'>
            Availability:{' '}
            <span
              className={`paragraph--success ${
                product.inventory === 0 ? 'paragraph--error' : undefined
              }`}
            >
              {product.inventory} pcs
            </span>
          </p>
        </div>

        {product.inventory === 0 ? (
          <p className='paragraph--error'>Out of stock</p>
        ) : (
          <div className='product-detail__sub-section quantity-control'>
            <div
              className='qty-action'
              style={{ cursor: quantity === 1 ? 'not-allowed' : undefined }}
              onClick={() =>
                setQuantity((prev) => {
                  if (prev < 2) return prev

                  return prev - 1
                })
              }
            >
              <FontAwesomeIcon icon={['fas', 'minus']} size='xs' color='grey' />
            </div>

            <div className='qty-action qty-action--qty'>
              <p className='paragraph'>{quantity}</p>
            </div>

            <div
              className='qty-action'
              style={{
                cursor:
                  (existingCartItem
                    ? quantity + existingCartItem.quantity
                    : quantity) === product.inventory
                    ? 'not-allowed'
                    : undefined,
              }}
              onClick={() =>
                setQuantity((prev) => {
                  // Check if added qty + existing qty is over than the inventory
                  if (
                    prev +
                      (existingCartItem ? existingCartItem.quantity : 0) ===
                    product.inventory
                  )
                    return prev

                  return prev + 1
                })
              }
            >
              <FontAwesomeIcon icon={['fas', 'plus']} size='xs' color='grey' />
            </div>
          </div>
        )}

        <Button
          disabled={
            product.inventory === 0 ||
            product.inventory === existingCartItem?.quantity ||
            addToCartLoading
          }
          loading={addToCartLoading}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>

      {openDialog && isSuccess && addedCartItem && (
        <ConfirmAddToCartDialog
          header='Added to cart'
          cartItem={{
            ...addedCartItem,
            quantity,
            title: product.title,
            image_url: product.image_url,
          }}
          goToCart={() => {
            setOpenDialog(false)
            history.push('/my-cart')
          }}
          continueShopping={() => {
            setOpenDialog(false)
            history.push('/')
          }}
        />
      )}
    </div>
  )
}

export default ProductDetail
