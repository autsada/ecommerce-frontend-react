import { useQuery } from 'react-query'
import axios from 'axios'

import { Product } from '../types'

export const useProduct = (id: string) => {
  return useQuery<Product, { message: string }>(
    ['product', id],
    () =>
      axios({
        url: `${process.env.REACT_APP_BACKEND_URI!}/products/${id}`,
        method: 'GET',
      }).then((res) => res.data.product),
    { staleTime: 60000 * 10 }
  )
}
