import React, { useState, useEffect } from 'react'

import Spinner from '../../../components/Spinner'
import OrderItem from '../components/OrderItem'
import Tab from '../../../components/Tab'
import { useSelectTab } from '../../../hooks/useSelectTab'
import { useOrders } from '../hooks/useOrders'
import { OrderTab } from '../../../types'
import { orderTabs } from '../../../utils/helpers'

interface Props {}

export const orderTabType = 'type'

const ManageOrders: React.FC<Props> = () => {
  const { data: orders, isLoading, error } = useOrders()
  const { activeTab } = useSelectTab<OrderTab>(orderTabType, 'All')

  const [ordersByTab, setOrdersByTab] = useState(orders)

  useEffect(() => {
    if (orders) {
      setOrdersByTab(
        activeTab === 'All'
          ? orders
          : orders.filter((order) => order.shipment_status === activeTab)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, orders, setOrdersByTab])

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  if (!orders || orders.length === 0)
    return <h2 className='header--center'>Your have no orders.</h2>

  return (
    <div className='page--orders'>
      <div className='orders-header'>
        <h2 className='header header--orders'>Manage orders</h2>

        <div className='orders-tabs'>
          {orderTabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              activeTab={activeTab}
              tabType={orderTabType}
            />
          ))}
        </div>
      </div>

      <div className='orders-details'>
        <div className='orders-content'>
          <div className='orders-column'>
            <h3 className='header--center'>Purchased date</h3>
          </div>
          <div className='orders-column orders-column--hide'>
            <h3 className='header--center'>Quantity</h3>
          </div>
          <div className='orders-column'>
            <h3 className='header--center'>Amount ($)</h3>
          </div>
          <div className='orders-column'>
            <h3 className='header--center'>Shipment status</h3>
          </div>
          <div className='orders-column orders-column--hide'>
            <h3 className='header--center'>Buyer</h3>
          </div>
          <div className='orders-column orders-column--manage'>
            <h3 className='header--center'>Manage order</h3>
          </div>
        </div>

        {/* OrderInfo */}
        {!ordersByTab || ordersByTab.length === 0 ? (
          <h3 className='header--center'>No orders.</h3>
        ) : (
          ordersByTab.map((order) => <OrderItem key={order.id} order={order} />)
        )}
      </div>

      {error && <h3 className='header--center'>{error.message}</h3>}
    </div>
  )
}

export default ManageOrders
