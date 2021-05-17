import React, { useState } from 'react'

import Spinner from '../components/Spinner'
import Pagination from '../components/Pagination'
import ProductItem from '../components/ProductItem'
import { useProducts } from '../hooks/useProducts'
export const prodTabType = 'cat'
export const productsPerPage = +process.env.REACT_APP_PRODUCTS_PER_PAGE_CLIENT!

interface Props {}

const Index: React.FC<Props> = () => {
  const [page, setPage] = useState(1)
  const { data, isPreviousData, isLoading, error } = useProducts(
    page,
    productsPerPage
  )

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  if (!data || data.products.length === 0)
    return <h2 className='header header--center'>No products</h2>

  const { products, totalQueries, hasMore } = data

  return (
    <div className='page--products'>
      {totalQueries > 0 && (
        <div className='pagination-container'>
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalQueries}
            hasMore={hasMore}
            isPreviousData={isPreviousData}
          />
        </div>
      )}

      <div className='products'>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {error && <p className='paragrapn paragraph--error'>{error.message}</p>}
    </div>
  )
}

export default Index
