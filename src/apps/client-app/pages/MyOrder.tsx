import React from 'react'
import { useParams } from 'react-router-dom'

import Spinner from '../../../components/Spinner'
import PageNotFound from '../../../pages/NotFound'
import { useOrder } from '../hooks/useOrder'
import { formatAmount, formatDate } from '../../../utils/helpers'

interface Props {}

const OrderDetail: React.FC<Props> = () => {
  const params = useParams<{ orderId: string }>()
  const { data: order, isLoading, error } = useOrder(params.orderId)

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  if (error) return <h2 className='header--center'>{error.message}</h2>

  if (!order) return <PageNotFound />

  const {
    id,
    amount,
    items,
    shipping_address: { fullname, address1, address2, city, zip_code, phone },
    payment_status,
    shipment_status,
    created_at,
  } = order

  return (
    <div className='page--order-details'>
      <h2 className='header'>Your order detail</h2>

      <div className='order-section'>
        <h4 className='header'>Order ID:</h4>
        <div className='order-section__content'>
          <p className='paragraph paragraph--focus'>{id}</p>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Order date:</h4>
        <div className='order-section__content'>
          <p className='paragraph paragraph--focus'>{formatDate(created_at)}</p>
          {/* <p className='paragraph paragraph--focus'>{formatDate(createdAt)}</p> */}
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Purchased Items:</h4>
        {items.map(({ quantity, id, title, price }, i) => (
          <div key={id} className='order-section__content'>
            <div className='order-item'>
              <p className='paragraph paragraph--focus' style={{ width: '5%' }}>
                {i + 1}
              </p>
              <p
                className='paragraph paragraph--focus'
                style={{ width: '50%' }}
              >
                {title}
              </p>
              <p
                className='paragraph paragraph--focus'
                style={{ width: '15%' }}
              >
                {quantity} x {formatAmount(price)}
              </p>
              <p className='paragraph paragraph--focus' style={{ width: '5%' }}>
                =
              </p>
              <p
                className='paragraph paragraph--focus'
                style={{ width: '20%' }}
              >
                ${formatAmount(quantity * price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='order-section'>
        <h4 className='header'>Order amount:</h4>
        <div className='order-section__content'>
          <p className='paragraph paragraph--focus'>${formatAmount(amount)}</p>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Delivery address:</h4>
        <div className='order-section__content'>
          <div className='order-address'>
            <p className='paragraph'>
              Recipient name:{' '}
              <span className='paragraph--focus'>{fullname}</span>
            </p>
            <p className='paragraph paragraph--focus'>
              {address1}, {address2 ? address2 : ''}, {city}, {zip_code}, Tel:{' '}
              {phone}
            </p>
          </div>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Payment status:</h4>
        <div className='order-section__content'>
          <p className='paragraph paragraph--focus'>
            {payment_status || 'n/a'}
          </p>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Shippment status:</h4>
        <div className='order-section__content'>
          <p
            className='paragraph paragraph--focus'
            style={{
              color:
                shipment_status === 'New'
                  ? 'blue'
                  : shipment_status === 'Preparing'
                  ? 'chocolate'
                  : shipment_status === 'Shipped'
                  ? 'green'
                  : shipment_status === 'Delivered'
                  ? 'grey'
                  : shipment_status === 'Canceled'
                  ? 'red'
                  : undefined,
            }}
          >
            {shipment_status || 'n/a'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
