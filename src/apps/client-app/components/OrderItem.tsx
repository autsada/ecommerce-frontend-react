import React from 'react'
import { Link } from 'react-router-dom'

import { OrderDetail } from '../../../types'
import { formatAmount, formatDate } from '../../../utils/helpers'

interface Props {
  order: OrderDetail
}

const OrderItem: React.FC<Props> = ({
  order: { id, created_at, shipment_status, quantity, amount },
}) => {
  return (
    <Link to={`/my-orders/${id}`}>
      <div className='orders-content orders-content--content'>
        <div className='orders-column'>
          <p className='paragraph--center paragraph--focus'>
            {formatDate(created_at)}
          </p>
        </div>
        <div className='orders-column'>
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
      </div>
    </Link>
  )
}

export default OrderItem
