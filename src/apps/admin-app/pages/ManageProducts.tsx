import React, { useState } from 'react'

import Button from '../../../components/Button'
import Spinner from '../../../components/Spinner'
import ProductItem from '../components/ProductItem'
import AddProductForm from '../components/AddProductForm'
import AlertDialog from '../../../components/AlertDialog'
import Pagination from '../../../components/Pagination'
import { useProducts } from '../../../hooks/useProducts'
import { useDeleteProduct } from '../hooks/useDeleteProduct'
import { Product } from '../../../types'

const productsPerPage = +process.env.REACT_APP_PRODUCTS_PER_PAGE_ADMIN!

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [page, setPage] = useState(1)

  const { data, isPreviousData, isLoading, error } = useProducts(
    page,
    productsPerPage
  )

  const [openProductForm, setOpenProductForm] = useState(false)
  const [productToEdit, setProductToEdit] =
    useState<Product | undefined>(undefined)
  const [productToDelete, setProductToDelete] =
    useState<Product | undefined>(undefined)
  const [openDialog, setOpenDialog] = useState(false)
  const {
    mutate: deleteProduct,
    isLoading: deleteProdLoading,
    error: deleteProdError,
  } = useDeleteProduct({ setOpenDialog, setProductToDelete })

  const handleDeleteProduct = async () => {
    if (productToDelete) return deleteProduct({ productId: productToDelete.id })
  }

  if (isLoading) return <Spinner color='grey' width={50} height={50} />

  return (
    <div className='page--manage-products'>
      <div className='manage-products__section'>
        <Button
          className='btn--orange'
          width='12rem'
          onClick={() => setOpenProductForm(true)}
        >
          Add new product
        </Button>

        {openProductForm && (
          <AddProductForm
            setOpenProductForm={setOpenProductForm}
            productToEdit={productToEdit}
            setProductToEdit={setProductToEdit}
          />
        )}
      </div>

      {data && data.totalQueries > 0 && (
        <div className='pagination-container'>
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={data.totalQueries}
            hasMore={data.hasMore}
            isPreviousData={isPreviousData}
          />
        </div>
      )}

      <div className='manage-products__section'>
        {!data || !data.products || data.products.length === 0 ? (
          <h2 className='header--center'>No products, let's add one.</h2>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th className='table-cell'>Title</th>
                <th className='table-cell'>Image</th>
                <th className='table-cell'>Price ($)</th>
                <th className='table-cell table-cell--hide'>Created At</th>
                <th className='table-cell table-cell--hide'>Updated At</th>
                <th className='table-cell'>Inventory</th>
              </tr>
            </thead>

            <tbody>
              {data.products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  setOpenProductForm={setOpenProductForm}
                  setProductToEdit={setProductToEdit}
                  setOpenDialog={setOpenDialog}
                  setProductToDelete={setProductToDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {error && <p className='paragraph paragraph--error'>{error.message}</p>}

      {openDialog && productToDelete && (
        <AlertDialog
          header='Please confirm'
          message={`Are you sure you want to delete the product: ${
            productToDelete ? productToDelete?.title : 'item'
          }?`}
          onCancel={() => {
            setProductToDelete(undefined)
            setOpenDialog(false)
          }}
          onConfirm={handleDeleteProduct}
          loading={deleteProdLoading}
          error={deleteProdError?.message}
        />
      )}
    </div>
  )
}

export default ManageProducts
