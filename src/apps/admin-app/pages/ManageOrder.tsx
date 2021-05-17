import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'

import Spinner from '../../../components/Spinner'
import Button from '../../../components/Button'
import PageNotFound from '../../../pages/NotFound'
import ShipmentStatusControl from '../components/ShipmentStatusControl'
import { useOrder } from '../hooks/useOrder'
import { formatAmount, formatDate } from '../../../utils/helpers'

interface Props {}

const ManageOrder: React.FC<Props> = () => {
  const params = useParams<{ orderId: string }>()

  const { data: order, isLoading, error } = useOrder(params.orderId)

  const labelRef = useRef<HTMLDivElement>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const printShippingLabel = useReactToPrint({
    content: () => labelRef.current,
    documentTitle: `Shipping label - ${params.orderId}`,
  })

  const printInvoice = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice - ${params.orderId}`,
  })

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
      <h2 className='header'>Order detail</h2>

      <div className='order-printing'>
        {shipment_status === 'New' ? (
          <>
            {/* Shipping label */}
            <div className='order-printing__section'>
              <Button
                width='100%'
                className='btn--orange'
                onClick={printShippingLabel}
              >
                Print shipping label
              </Button>

              <div className='print-component'>
                <div className='page shipping-label' ref={labelRef}>
                  <div className='label'>
                    <h4 className='header'>Recipient: {fullname}</h4>
                    <p className='paragraph'>{address1},</p>
                    {address2 && <p className='paragraph'>{address2}</p>}
                    <p className='paragraph'>
                      {city}, {zip_code}
                    </p>
                    <p className='paragraph'>Tel: {phone}</p>

                    <p className='paragraph'>
                      Order number:{' '}
                      <span className='paragraph--focus'>{id}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice */}
            <div className='order-printing__section'>
              <Button
                width='100%'
                className='btn--orange'
                onClick={printInvoice}
              >
                Print invoice
              </Button>

              <div className='print-component'>
                <div className='page invoice' ref={invoiceRef}>
                  <h1 className='header--center'>AwesomeShop</h1>

                  <div className='invoice__head'>
                    <h3 className='header'>Seller:</h3>
                    <h4 className='header'>AwesomeShop</h4>
                    <p className='paragraph'>2214 Willison Street</p>
                    <p className='paragraph'>Big Lake</p>
                    <p className='paragraph'>Minnesota 73128</p>
                    <p className='paragraph'>Tel: 405-474-0406</p>
                  </div>

                  <div className='invoice__head'>
                    <h3 className='header'>Buyer:</h3>
                    <h4 className='header'>{fullname}</h4>
                    <p className='paragraph'>{address1}</p>
                    {address2 && <p className='paragraph'>{address2}</p>}
                    <p className='paragraph'>
                      {city} {zip_code}
                    </p>
                    <p className='paragraph'>Tel: {phone}</p>
                  </div>

                  <div className='invoice__head'>
                    <p className='paragraph'>
                      Invoice no: <span className='paragraph--focus'>{id}</span>
                    </p>
                    <p className='paragraph'>
                      Invoice date:{' '}
                      <span className='paragraph--focus'>
                        {formatDate(created_at)}
                        {/* {formatDate(createdAt)} */}
                      </span>
                    </p>
                  </div>

                  <table className='table invoice__items'>
                    <thead className='invoice__header-row'>
                      <tr>
                        <th className='table-cell'>Item</th>
                        <th className='table-cell' style={{ width: '40%' }}>
                          Description
                        </th>
                        <th className='table-cell'>Qty</th>
                        <th className='table-cell'>Price</th>
                        <th className='table-cell'>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.items.map(({ quantity, title, price }, i) => (
                        <tr key={i}>
                          <td className='table-cell paragraph--center'>
                            {i + 1}
                          </td>
                          <td className='table-cell paragraph--center'>
                            {title}
                          </td>
                          <td className='table-cell paragraph--center'>
                            {quantity}
                          </td>
                          <td className='table-cell paragraph--center'>
                            {formatAmount(price)}
                          </td>
                          <td className='table-cell paragraph--center'>
                            {formatAmount(quantity * price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3 className='header'>
                    Total amount: ${formatAmount(amount)}
                  </h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h3
            className='header paragraph--focus'
            style={{
              color:
                shipment_status === 'Preparing'
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
            {shipment_status}
          </h3>
        )}
      </div>

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
          <ShipmentStatusControl order={order} />
        </div>
      </div>
    </div>
  )
}

export default ManageOrder
