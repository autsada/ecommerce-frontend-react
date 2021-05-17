import { useQuery } from 'react-query'
import axios from 'axios'

import { Product } from '../types'

export const useProducts = (page: number = 0, perPage: number) => {
  return useQuery<
    { products: Product[]; totalQueries: number; hasMore: boolean },
    { message: string }
  >(
    ['products', page, perPage],
    () =>
      axios({
        url: `${process.env
          .REACT_APP_BACKEND_URI!}/products/?q=${page}&l=${perPage}`,
        method: 'GET',
      }).then((res) => res.data),
    { keepPreviousData: true, staleTime: 1000 * 60 * 10 } // 10 mins
  )
}
