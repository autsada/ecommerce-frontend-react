import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { useAddAddress } from '../hooks/useAddAddress'
import { useUpdateAddress } from '../hooks/useUpdateAddress'
import { Address, User } from '../../../types'

interface Props {
  user: User | undefined
  addressToEdit: Address | undefined
  setAddressToEdit: (address: Address | undefined) => void
}

const AddAndEditAddress: React.FC<Props> = ({
  addressToEdit,
  setAddressToEdit,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Omit<Address, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>()

  const { mutate: addAddress, isLoading, error } = useAddAddress(reset)
  const {
    mutate: updateAddress,
    isLoading: updateLoading,
    error: updateError,
  } = useUpdateAddress({ resetForm: reset, setAddressToEdit })

  useEffect(() => {
    if (addressToEdit) reset()
  }, [addressToEdit])

  const handleAddNewAddress = handleSubmit((data) => addAddress(data))

  const handleUpdateAddress = handleSubmit(async (data) => {
    if (!addressToEdit) return

    // Check if no changes have been made
    const { id, fullname, address1, address2, city, zip_code, phone } =
      addressToEdit

    if (
      fullname === data.fullname &&
      address1 === data.address1 &&
      address2 === data.address2 &&
      city === data.city &&
      zip_code === data.zip_code &&
      phone === data.phone
    ) {
      alert('No changes have been made.')
      return
    }

    return updateAddress({
      id,
      fullname: data.fullname,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      zip_code: data.zip_code,
      phone: data.phone,
    })
  })

  return (
    <form
      className='form'
      onSubmit={!addressToEdit ? handleAddNewAddress : handleUpdateAddress}
      style={{ width: '100%' }}
    >
      <p
        className='paragraph paragraph--success paragraph--focus'
        style={{ cursor: 'pointer', textAlign: 'end', marginRight: '0.5rem' }}
        onClick={() => {
          reset()
          setAddressToEdit(undefined)
        }}
      >
        Clear all
      </p>
      <Input
        label='Fullname'
        placeholder='Your full name'
        defaultValue={addressToEdit ? addressToEdit.fullname : ''}
        error={errors.fullname?.message}
        {...register('fullname', { required: 'Full name is required.' })}
      />
      <Input
        label='Address1'
        placeholder='Street address, P.O. box, company name'
        defaultValue={addressToEdit ? addressToEdit.address1 : ''}
        error={errors.address1?.message}
        {...register('address1', {
          required: 'Street address, P.O. box, company name are required.',
        })}
      />
      <Input
        label='Address2'
        placeholder='Apartment, suite, building, floor, etc.'
        defaultValue={addressToEdit ? addressToEdit.address2 : ''}
        {...register('address2')}
      />
      <Input
        label='City'
        placeholder='City'
        defaultValue={addressToEdit ? addressToEdit.city : ''}
        error={errors.city?.message}
        {...register('city', {
          required: 'City is required.',
        })}
      />
      <Input
        label='Zipcode'
        placeholder='Zip code'
        defaultValue={addressToEdit ? addressToEdit.zip_code : ''}
        error={errors.zip_code?.message}
        {...register('zip_code', {
          required: 'Zip code is required.',
        })}
      />
      <Input
        label='Phone'
        placeholder='Your phone number'
        defaultValue={addressToEdit ? addressToEdit.phone : ''}
        error={errors.phone?.message}
        {...register('phone', {
          required: 'Phone is required.',
        })}
      />

      <Button
        width='100%'
        disabled={isLoading || updateLoading}
        loading={isLoading || updateLoading}
      >
        Submit
      </Button>

      {error && <p className='paragraph paragraph--error'>{error.message}</p>}
      {updateError && (
        <p className='paragraph paragraph--error'>{updateError.message}</p>
      )}
    </form>
  )
}

export default AddAndEditAddress
