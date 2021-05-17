import React, { useState, useEffect } from 'react'

import Spinner from '../../../components/Spinner'
import Tab from '../../../components/Tab'
import OrderItem from '../components/OrderItem'
import { useOrders } from '../hooks/useOrders'
import { useSelectTab } from '../../../hooks/useSelectTab'
import { orderTabs } from '../../../utils/helpers'
import { OrderTab } from '../../../types'

export const orderTabType = 'type'

interface Props {}

const MyOrders: React.FC<Props> = () => {
  const { data: orders, isLoading, error } = useOrders()
  const { activeTab } = useSelectTab<OrderTab>(orderTabType, 'New')

  const [ordersByTab, setOrdersByTab] = useState(
    orders ? orders.filter((order) => order.shipment_status === 'New') : null
  )

  useEffect(() => {
    if (!orders) {
      setOrdersByTab(null)
      return
    }

    if (activeTab === 'All') setOrdersByTab(orders)
    else
      setOrdersByTab(
        orders.filter((order) => order.shipment_status === activeTab)
      )
  }, [activeTab, orders, setOrdersByTab])

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  if (error) return <h2 className='header--center'>{error.message}</h2>

  if (!orders || orders.length === 0)
    return <h2 className='header--center'>Your have no orders.</h2>

  return (
    <div className='page--orders'>
      <div className='orders-header'>
        <h2 className='header header--orders'>Your orders</h2>

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
          <div className='orders-column'>
            <h3 className='header--center'>Quantity</h3>
          </div>
          <div className='orders-column'>
            <h3 className='header--center'>Amount ($)</h3>
          </div>
          <div className='orders-column'>
            <h3 className='header--center'>Shipment status</h3>
          </div>
        </div>

        {/* Order */}
        {ordersByTab &&
          ordersByTab.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
      </div>
    </div>
  )
}

export default MyOrders
