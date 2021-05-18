import React, { useRef, ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useAddProduct } from '../hooks/useAddProduct'
import { useUpdateProduct } from '../hooks/useUpdateProduct'
import { Product } from '../../../types'
import { categories } from '../../../utils/helpers'

const fileType = ['image/png', 'image/jpeg', 'image/jpg']

interface Props {
  setOpenProductForm: (open: boolean) => void
  productToEdit: Product | undefined
  setProductToEdit: (product: Product | undefined) => void
}

const AddProductForm: React.FC<Props> = ({
  setOpenProductForm,
  productToEdit,
  setProductToEdit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    Pick<
      Product,
      | 'title'
      | 'description'
      | 'price'
      | 'category'
      | 'inventory'
      | 'image_file_name'
    >
  >()

  const [image, setImage] = useState<File | undefined>()

  const {
    mutate: addProduct,
    isLoading,
    error,
  } = useAddProduct(setOpenProductForm)
  const {
    mutate: updateProduct,
    isLoading: updateProductLoading,
    error: updateProductError,
  } = useUpdateProduct({ setOpenProductForm, setProductToEdit })

  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpenUploadBox = () => {
    if (inputRef?.current) inputRef.current.click()
  }

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || !files[0]) return

    const file = files[0]

    if (!fileType.includes(file.type)) {
      alert('Wrong file format, allow only "png" or "jpeg", or "jpg"')
      return
    }

    setImage(file)
  }

  const handleAddProduct = handleSubmit(
    ({ title, description, price, category, inventory }) => {
      if (!image) return

      const formData = new FormData()

      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', `${price}`)
      formData.append('image', image)
      formData.append('category', category)
      formData.append('inventory', `${inventory}`)

      return addProduct(formData)
    }
  )

  const handleUpdateProduct = handleSubmit((data) => {
    if (!productToEdit) return

    const { id, title, description, price, category, inventory } = productToEdit

    // Check if the product data has been changed
    const isNotEdited =
      title === data.title &&
      description === data.description &&
      +price === +data.price &&
      category === data.category &&
      +inventory === +data.inventory &&
      !image

    // 1. Nothing changed
    if (isNotEdited) {
      alert('Nothing changed')
      return
    }

    // 2. Something changed
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('price', `${data.price}`)
    formData.append('category', data.category)
    formData.append('inventory', `${data.inventory}`)
    if (image) formData.append('image', image)

    return updateProduct({ data: formData, productId: id })
  })

  return (
    <>
      <div
        className='backdrop'
        onClick={() => {
          setProductToEdit(undefined)
          setOpenProductForm(false)
        }}
      >
        {' '}
      </div>

      <div className='modal modal--add-product'>
        <div
          className='modal-close'
          onClick={() => {
            setProductToEdit(undefined)
            setOpenProductForm(false)
          }}
        >
          &times;
        </div>

        <h2 className='header--center'>
          {productToEdit ? 'Edit A Product' : 'Add A New Product'}
        </h2>

        <form
          className='form'
          onSubmit={productToEdit ? handleUpdateProduct : handleAddProduct}
        >
          {/* Title */}
          <Input
            label='Title'
            placeholder='Product title'
            defaultValue={productToEdit ? productToEdit.title : ''}
            {...register('title', {
              required: 'Titile is requried.',
              minLength: {
                value: 3,
                message: 'Product title must be at least 3 characters.',
              },
            })}
            error={errors.title?.message}
          />

          {/* Description */}
          <Input
            label='Description'
            placeholder='Product description'
            defaultValue={productToEdit ? productToEdit.description : ''}
            {...register('description', {
              required: 'Description is requried.',
              minLength: {
                value: 6,
                message: 'Product description must be at least 6 characters.',
              },
              maxLength: {
                value: 200,
                message:
                  'Product description must be not more than 200 characters.',
              },
            })}
            error={errors.description?.message}
          />

          {/* Price */}
          <Input
            label='Price'
            type='number'
            placeholder='Product price'
            defaultValue={productToEdit ? productToEdit.price : ''}
            {...register('price', {
              required: 'Price is requried.',
              min: {
                value: 1,
                message: 'Product price must have at least $1.',
              },
            })}
            error={errors.price?.message}
          />

          {/* Image */}
          <div className='form__input-container'>
            <label htmlFor='Image' className='form__input-label'>
              Image
            </label>

            <div className='form__input-file-upload'>
              {isLoading || updateProductLoading ? (
                <div style={{ width: '70%' }}>
                  <input
                    type='text'
                    className='upload-progression'
                    style={{
                      width: `100%`,
                      color: 'white',
                      textAlign: 'center',
                    }}
                    value={`100%`}
                    readOnly
                  />
                </div>
              ) : (
                <input
                  type='text'
                  className='input'
                  readOnly
                  style={{
                    width: '70%',
                    cursor: 'pointer',
                    color: 'chocolate',
                    fontSize: '12px',
                  }}
                  onClick={handleOpenUploadBox}
                  value={
                    image
                      ? image.name
                      : productToEdit
                      ? `To edit the image, select a new photo.`
                      : ''
                  }
                  {...register('image_file_name', {
                    required: 'Product image is required.',
                  })}
                />
              )}

              <Button
                width='30%'
                height='100%'
                type='button'
                style={{ borderRadius: '0', border: '1px solid #282c3499' }}
                onClick={handleOpenUploadBox}
              >
                <span className='paragraph--small'>Select image</span>
              </Button>

              <input
                type='file'
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleSelectImage}
              />
            </div>

            {errors?.image_file_name && !image && (
              <p className='paragraph paragraph--error-small'>
                {errors.image_file_name.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className='form__input-container'>
            <label htmlFor='Category' className='form__input-label'>
              Category
            </label>

            <select
              className='input'
              defaultValue={productToEdit ? productToEdit.category : undefined}
              {...register('category', {
                required: 'Product category is required.',
              })}
            >
              <option style={{ display: 'none' }}></option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {errors?.category && (
              <p className='paragraph paragraph--error-small'>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Inventory */}
          <Input
            label='Inventory'
            type='number'
            placeholder='Product inventory'
            defaultValue={productToEdit ? productToEdit.inventory : ''}
            {...register('inventory', {
              required: 'Inventory is requried.',
              min: 0,
              pattern: {
                value: /^[0-9]\d*$/,
                message: 'Inventory must be the positive whole number.',
              },
            })}
            error={errors.inventory?.message}
          />

          <Button
            className='btn--orange'
            width='100%'
            style={{ marginTop: '1rem' }}
            loading={isLoading || updateProductLoading}
            disabled={isLoading || updateProductLoading}
          >
            Submit
          </Button>
        </form>

        {error && <p className='paragraph paragraph--error'>{error.message}</p>}
        {updateProductError && (
          <p className='paragraph paragraph--error'>
            {updateProductError.message}
          </p>
        )}
      </div>
    </>
  )
}

export default AddProductForm
