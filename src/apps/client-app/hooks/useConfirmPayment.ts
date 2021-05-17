import { Stripe, CreatePaymentMethodCardData } from '@stripe/stripe-js'

import { useCreateOrder } from './useCreateOrder'

export const useConfirmCardPayment = ({
  setSucceeded,
  setProcessing,
  setConfirmPaymentError,
}: {
  setSucceeded: (success: boolean) => void
  setProcessing: (processing: boolean) => void
  setConfirmPaymentError: (error: string) => void
}) => {
  const { mutate: createOrder } = useCreateOrder({
    setProcessing,
    setSucceeded,
  })

  const confirmPayment = ({
    stripe,
    clientSecret,
    paymentMethod,
    save,
  }: {
    stripe: Stripe
    clientSecret: string
    paymentMethod:
      | string
      | Pick<
          CreatePaymentMethodCardData,
          'card' | 'billing_details' | 'metadata' | 'payment_method'
        >
      | undefined
    save?: boolean
  }) =>
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
        save_payment_method: save,
      })
      .then((confirmPayment) => {
        // If success, create new order
        if (confirmPayment.paymentIntent?.status === 'succeeded') {
          createOrder({
            paymentId: confirmPayment.paymentIntent.payment_method!,
            paymentStatus: confirmPayment.paymentIntent.status,
          })
        }

        // If error, set error message
        if (confirmPayment.error) {
          setConfirmPaymentError(
            confirmPayment.error.message || 'Sorry, the payment fail.'
          )
          setSucceeded(false)
          setProcessing(false)
        }

        return confirmPayment
      })
      .catch((error) => {
        setConfirmPaymentError(error.message || 'Sorry, the payment fail.')
        setSucceeded(false)
        setProcessing(false)

        return undefined
      })

  return { confirmPayment }
}
