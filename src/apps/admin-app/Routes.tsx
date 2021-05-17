import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../../pages/Index'
import Products from '../../pages/Products'
import ProductDetail from '../../pages/ProductDetail'
import ManageProducts from './pages/ManageProducts'
import ManageOrders from './pages/ManageOrders'
import ManageOrder from './pages/ManageOrder'
import ManageUsers from './pages/ManageUsers'
import NotFound from '../../pages/NotFound'

interface Props {}

const Routes: React.FC<Props> = () => {
  return (
    <Switch>
      <Route path='/admin/manage-users'>
        <ManageUsers />
      </Route>
      <Route path='/admin/manage-orders/:orderId'>
        <ManageOrder />
      </Route>
      <Route path='/admin/manage-orders'>
        <ManageOrders />
      </Route>
      <Route path='/admin/manage-products'>
        <ManageProducts />
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
