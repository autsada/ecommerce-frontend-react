import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../../pages/Index'
import Products from '../../pages/Products'
import ProductDetail from '../../pages/ProductDetail'
import NotFound from '../../pages/NotFound'

interface Props {}

const Routes: React.FC<Props> = () => {
  return (
    <Switch>
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
