import React from 'react'
import { Link } from 'react-router-dom'

import Button from '../../../components/Button'
import { OrderDetail } from '../../../types'
import { formatAmount, formatDate } from '../../../utils/helpers'

interface Props {
  order: OrderDetail
}

const OrderItem: React.FC<Props> = ({
  order: {
    id,
    created_at,
    quantity,
    amount,
    shipment_status,
    shipping_address,
  },
}) => {
  return (
    <Link to={`/admin/manage-orders/${id}`}>
      <div className='orders-content orders-content--content'>
        <div className='orders-column'>
          <p className='paragraph--center paragraph--focus'>
            {formatDate(created_at)}
            {/* {formatDate(createdAt)} */}
          </p>
        </div>
        <div className='orders-column orders-column--hide'>
          <p className='paragraph--center paragraph--focus'>{quantity}</p>
        </div>
        <div className='orders-column'>
          <p className='paragraph--center paragraph--focus'>
            {formatAmount(amount)}
          </p>
        </div>
        <div className='orders-column'>
          <p
            className='paragraph--center paragraph--focus'
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
            {shipment_status ? shipment_status : ''}
          </p>
        </div>
        <div className='orders-column orders-column--hide'>
          <p className='paragraph--center paragraph--focus'>
            {shipping_address.fullname}
          </p>
        </div>
        <div className='orders-column orders-column--manage'>
          <p className='paragraph--center paragraph--focus'>
            {shipment_status === 'Delivered' ? (
              'Done'
            ) : (
              <Button
                width='60%'
                className='btn--orange manage-order-btn--mobile'
              >
                Manage order
              </Button>
            )}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default OrderItem
