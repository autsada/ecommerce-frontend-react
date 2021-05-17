import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Product } from '../../../types'
import { formatAmount, formatDate } from '../../../utils/helpers'

interface Props {
  product: Product
  setOpenProductForm: (open: boolean) => void
  setProductToEdit: (product: Product | undefined) => void
  setOpenDialog: (open: boolean) => void
  setProductToDelete: (product: Product | undefined) => void
}

const ProductItem: React.FC<Props> = ({
  product,
  setOpenProductForm,
  setProductToEdit,
  setOpenDialog,
  setProductToDelete,
}) => {
  return (
    <tr>
      <td className='table-cell'>{product.title}</td>
      <td className='table-cell'>
        <img src={product.image_url} alt={product.title} width='30px' />
      </td>
      <td className='table-cell'>{formatAmount(product.price)}</td>
      <td className='table-cell table-cell--hide'>
        {formatDate(product.created_at)}
      </td>
      <td className='table-cell table-cell--hide'>
        {product.updated_at && formatDate(product.updated_at)}
      </td>
      <td
        className='table-cell'
        style={{ color: product.inventory === 0 ? 'red' : undefined }}
      >
        {product.inventory}
      </td>
      <td
        className='table-cell table-cell--icon'
        onClick={() => {
          setOpenProductForm(true)
          setProductToEdit(product)
        }}
      >
        <FontAwesomeIcon icon={['fas', 'edit']} size='1x' />
      </td>
      <td className='table-cell table-cell--icon'>
        <FontAwesomeIcon
          icon={['fas', 'trash-alt']}
          size='1x'
          color='red'
          onClick={() => {
            setProductToDelete(product)
            setOpenDialog(true)
          }}
        />
      </td>
    </tr>
  )
}

export default ProductItem
