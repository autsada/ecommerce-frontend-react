import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../../pages/Index'
import Products from '../../pages/Products'
import ProductDetail from '../../pages/ProductDetail'
import MyCart from './pages/MyCart'
import ShippingAddresses from './pages/ShippingAddresses'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import MyOrder from './pages/MyOrder'
import NotFound from '../../pages/NotFound'

interface Props {}

const Routes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route path='/my-orders/:orderId'>
        <MyOrder />
      </Route>
      <Route path='/my-orders'>
        <MyOrders />
      </Route>
      <Route path='/payment/checkout'>
        <Checkout />
      </Route>
      <Route path='/payment/shipping-addresses'>
        <ShippingAddresses />
      </Route>
      <Route path='/my-cart'>
        <MyCart />
      </Route>
      <Route path='/products/:productId'>
        <ProductDetail />
      </Route>
      <Route path='/products'>
        <Products />
      </Route>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='*'>
        <NotFound />
      </Route>
    </Switch>
  )
}

export default Routes
