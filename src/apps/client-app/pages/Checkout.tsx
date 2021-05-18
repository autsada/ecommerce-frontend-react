import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  PaymentMethod,
  StripeCardElementChangeEvent,
  CreatePaymentMethodCardData,
} from '@stripe/stripe-js'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'

import Spinner from '../../../components/Spinner'
import Button from '../../../components/Button'
import AlertDialog from '../../../components/AlertDialog'
import { useCheckout } from '../hooks/useCheckout'
import { useCart } from '../hooks/useCart'
import { useConfirmCardPayment } from '../hooks/useConfirmPayment'
import { useCards } from '../hooks/useCards'
import { useSetDefaultCard } from '../hooks/useSetDefaultCard'
import { useRemoveCard } from '../hooks/useRemoveCard'
import {
  calculateCartAmount,
  calculateCartQuantity,
} from '../../../utils/helpers'

interface Props {}

const Checkout: React.FC<Props> = () => {
  const [clientSecret, setClientSecret] = useState('')
  const [card, setCard] = useState<
    { type: 'new' } | { type: 'saved'; payment_method: string }
  >({ type: 'new' })
  const [newCardError, setNewCardError] = useState('')
  const [openSetDefault, setOpenSetDefault] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [succeeded, setSucceeded] = useState(false)
  const [confirmPaymentError, setConfirmPaymentError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] =
    useState<'inform_payment' | 'remove_card' | null>(null)
  const [cardToRemove, setCardToRemove] = useState<PaymentMethod | null>(null)

  const { data: cart, isLoading } = useCart()
  const { mutate: checkout, error: checkoutError } =
    useCheckout(setClientSecret)
  const { confirmPayment } = useConfirmCardPayment({
    setProcessing,
    setSucceeded,
    setConfirmPaymentError,
  })
  const { data: cards, isLoading: cardsLoading, error: cardsError } = useCards()
  const { mutate: setDefaultCard } = useSetDefaultCard()
  const {
    mutate: removeCard,
    isLoading: removeCardLoading,
    error: removeCardError,
  } = useRemoveCard({ setCardToRemove, setOpenDialog })

  const elements = useElements()
  const stripe = useStripe()

  const history = useHistory<{ address: string }>()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<{
    cardName: string
    save?: boolean
    setDefault?: boolean
  }>()

  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // As soon as the page loads, call the checkout endpoint
    checkout()
  }, [checkout])

  // If checkout error on the first render then try again
  useEffect(() => {
    if (checkoutError) checkout()
  }, [checkoutError, checkout])

  // Set type of card that will be used
  useEffect(() => {
    if (cards?.paymentMethods && cards.paymentMethods.length > 0) {
      setCard({
        type: 'saved',
        payment_method:
          cards.customer?.invoice_settings.default_payment_method ||
          cards.paymentMethods[0].id,
      })
      setDisabled(false)
      reset()
    } else {
      setCard({ type: 'new' })
      setDisabled(true)
      reset()
    }
  }, [cards, reset])

  // Once the payment succeeded, inform user
  useEffect(() => {
    if (succeeded) {
      setOpenDialog(true)
      setDialogType('inform_payment')
      reset()
    }
  }, [succeeded, reset])

  const handleClickBtn = () => {
    if (btnRef && btnRef.current) btnRef.current.click()
  }

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    setDisabled(e.empty || !e.complete)
    setNewCardError(e.error ? e.error.message : '')

    if (e.complete) setNewCardError('')
  }

  const handleCompletePayment = handleSubmit(async (data) => {
    if (!cart) return
    if (!stripe) return
    if (!elements) return
    if (!clientSecret) return

    setProcessing(true)
    setSucceeded(false)

    let paymentMethod:
      | string
      | Pick<
          CreatePaymentMethodCardData,
          'card' | 'billing_details' | 'metadata' | 'payment_method'
        >
      | undefined

    if (card.type === 'new') {
      // A. Use new card
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) return

      paymentMethod = {
        card: cardElement,
        billing_details: { name: data.cardName },
      }
    } else if (card.type === 'saved') {
      paymentMethod = card.payment_method
    }

    const confirmedPayment = await confirmPayment({
      stripe,
      clientSecret,
      paymentMethod,
      save: data.save,
    })

    if (data.setDefault) {
      // Set card as default
      const paymentMethodId = confirmedPayment?.paymentIntent?.payment_method
      if (paymentMethodId) {
        return setDefaultCard({ paymentMethodId })
      }
    }
  })

  const handleRemoveCard = () => {
    if (!cardToRemove) return

    return removeCard({ paymentMethodId: cardToRemove.id })
  }

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  return (
    <div className='page--checkout'>
      <div className='payment'>
        <h2 className='header'>Select a payment card</h2>

        <form className='form' onSubmit={handleCompletePayment}>
          {/* Saved Cards */}
          {cardsLoading ? (
            <Spinner color='grey' height={30} width={30} />
          ) : (
            cards &&
            cards.paymentMethods &&
            cards.paymentMethods.length > 0 &&
            cards.paymentMethods.map((method) => (
              <label key={method.id} className='card' htmlFor={method.id}>
                <input
                  type='radio'
                  name='card'
                  value={method.id}
                  style={{ width: '10%' }}
                  checked={
                    card.type === 'saved' && card.payment_method === method.id
                  }
                  onChange={() => {
                    setCard({ type: 'saved', payment_method: method.id })
                    setDisabled(false)
                    reset()
                  }}
                />

                <p className='paragraph' style={{ width: '40%' }}>
                  **** **** **** {method.card?.last4}
                </p>

                <p className='paragraph' style={{ width: '10%' }}>
                  {method.card?.brand === 'visa' ? (
                    <FontAwesomeIcon
                      icon={['fab', 'cc-visa']}
                      size='2x'
                      color='#206CAB'
                    />
                  ) : method.card?.brand === 'mastercard' ? (
                    <FontAwesomeIcon
                      icon={['fab', 'cc-mastercard']}
                      size='2x'
                      color='#EB2230'
                    />
                  ) : method.card?.brand === 'amex' ? (
                    <FontAwesomeIcon
                      icon={['fab', 'cc-amex']}
                      size='2x'
                      color='#099DD9'
                    />
                  ) : (
                    method.card?.brand
                  )}
                </p>

                <div style={{ width: '30%' }}>
                  {method.id ===
                  cards.customer?.invoice_settings.default_payment_method ? (
                    <p className='paragraph--center paragraph--focus'>
                      Default
                    </p>
                  ) : card.type === 'saved' &&
                    card.payment_method === method.id ? (
                    <div>
                      <input type='checkbox' {...register('setDefault')} />
                      <label htmlFor='setDefault' className='set-default-card'>
                        Set as default
                      </label>
                    </div>
                  ) : undefined}
                </div>

                <p
                  className='paragraph'
                  style={{ width: '10%', cursor: 'pointer' }}
                  onClick={() => {
                    setCardToRemove(method)
                    setOpenDialog(true)
                    setDialogType('remove_card')
                  }}
                >
                  <FontAwesomeIcon
                    icon={['fas', 'trash-alt']}
                    size='1x'
                    color='red'
                  />
                </p>
              </label>
            ))
          )}

          {/* New Card */}
          <div className='form--new-card'>
            <label htmlFor='newCard' className='card card--new'>
              <input
                type='radio'
                name='card'
                checked={card.type === 'new'}
                style={{ width: '10%' }}
                onChange={() => {
                  setCard({ type: 'new' })
                  setDisabled(true)
                  reset()
                }}
              />

              <h4
                className='paragraph paragraph--bold'
                style={{ width: '30%' }}
              >
                Use new card
              </h4>

              <p className='paragraph' style={{ width: '5%' }}>
                {' '}
              </p>

              <div className='new-card__logo' style={{ width: '45%' }}>
                <FontAwesomeIcon
                  icon={['fab', 'cc-visa']}
                  size='1x'
                  style={{ margin: '0 0.5rem' }}
                  color='#206CAB'
                />
                <FontAwesomeIcon
                  icon={['fab', 'cc-mastercard']}
                  size='1x'
                  style={{ margin: '0 0.5rem' }}
                  color='#EB2230'
                />
                <FontAwesomeIcon
                  icon={['fab', 'cc-amex']}
                  size='1x'
                  style={{ margin: '0 0.5rem' }}
                  color='#099DD9'
                />
              </div>

              <p className='paragraph' style={{ width: '10%' }}>
                {' '}
              </p>
            </label>

            {card.type === 'new' && (
              <div className='new-card__form'>
                <div className='form__input-container form__input-container--card'>
                  <input
                    type='text'
                    className='input input--card-name'
                    placeholder='Name on card'
                    {...register('cardName', {
                      required: 'Card name is required.',
                    })}
                  />

                  {errors.cardName && (
                    <p className='paragraph paragraph--small paragraph--error'>
                      {errors.cardName.message}
                    </p>
                  )}
                </div>

                <div className='form__input-container form__input-container--card'>
                  <CardElement
                    options={{
                      style: {
                        base: { color: 'blue', iconColor: 'blue' },
                        invalid: { color: 'red', iconColor: 'red' },
                      },
                    }}
                    onChange={handleCardChange}
                  />

                  {newCardError && (
                    <p className='paragraph paragraph--error'>{newCardError}</p>
                  )}
                </div>

                <div className='form__set-new-card'>
                  <div className='form__input-container'>
                    <input
                      type='checkbox'
                      {...register('save')}
                      onClick={() => setOpenSetDefault((prev) => !prev)}
                    />
                    <label htmlFor='saveCard' className='paragraph'>
                      Save this card
                    </label>
                  </div>

                  {openSetDefault && (
                    <div className='form__input-container'>
                      <input type='checkbox' {...register('setDefault')} />
                      <label htmlFor='setDefault' className='paragraph'>
                        Set as default
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hidden Button */}
          <button ref={btnRef} style={{ display: 'none' }}></button>
        </form>

        {checkoutError && (
          <p className='paragraph paragraph--error'>{checkoutError.message}</p>
        )}

        {cardsError && (
          <p className='paragraph paragraph--error'>{cardsError.message}</p>
        )}
      </div>

      <div className='summary'>
        {/* Shipping Address */}
        {cart && (
          <div className='summary__section'>
            <h3 className='header'>Delivery address</h3>

            <p className='paragraph paragraph--focus'>
              {cart.shipping_address?.fullname}:
            </p>
            <p className='paragraph paragraph--focus'>
              {cart.shipping_address?.address1}
            </p>
            {cart.shipping_address?.address2 && (
              <p className='paragraph paragraph--focus'>
                {cart.shipping_address?.address2}
              </p>
            )}
            <p className='paragraph paragraph--focus'>
              {cart.shipping_address?.city}, {cart.shipping_address?.zip_code}
            </p>
            <p className='paragraph paragraph--focus'>
              Tel: {cart.shipping_address?.phone}
            </p>
          </div>
        )}

        {/* Order summary */}
        <div className='summary__section'>
          <h3 className='header'>Order summary</h3>

          <div className='order-summary'>
            <div>
              <p className='paragraph paragraph--focus'>Total quantity:</p>
              <p className='paragraph paragraph--focus'>Total amount:</p>
            </div>
            <div>
              <p className='paragraph paragraph--focus'>
                {cart?.items && calculateCartQuantity(cart.items)} pcs
              </p>
              <p className='paragraph paragraph--focus'>
                ${cart?.items && calculateCartAmount(cart.items)}
              </p>
            </div>
          </div>
        </div>

        <div className='summary__section'>
          <Button
            width='100%'
            className='btn--orange btn--payment'
            onClick={handleClickBtn}
            disabled={!stripe || !card || disabled || processing}
            loading={processing}
          >
            Complete payment
          </Button>
        </div>

        {confirmPaymentError && (
          <p className='paragraph paragraph--error'>{confirmPaymentError}</p>
        )}
      </div>

      {openDialog && dialogType === 'inform_payment' && (
        <AlertDialog
          header='Confirm Payment'
          message='You have successfully made the payment, you can click "Ok" below to view your order.'
          onConfirm={() => {
            setOpenDialog(false)
            setDialogType(null)
            history.replace('/my-orders')
          }}
          confirmText='Ok'
        />
      )}

      {openDialog && dialogType === 'remove_card' && cardToRemove && (
        <AlertDialog
          header='Please confirm'
          message={`Are you sure you want to remove ${cardToRemove.card?.brand}: **** **** **** ${cardToRemove.card?.last4}?`}
          onCancel={() => {
            setCardToRemove(null)
            setOpenDialog(false)
            setDialogType(null)
          }}
          onConfirm={handleRemoveCard}
          loading={removeCardLoading}
          error={removeCardError?.message}
        />
      )}
    </div>
  )
}

export default Checkout
