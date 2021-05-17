import React, { useState } from 'react'

import ShippingAddress from '../components/ShippingAddress'
import AddAndEditAddress from '../components/AddAndEditAddress'
import AlertDialog from '../../../components/AlertDialog'
import Spinner from '../../../components/Spinner'
import { useAddresses } from '../hooks/useAddresses'
import { useDeleteAddress } from '../hooks/useDeleteAddress'
import { Address } from '../../../types'

interface Props {}

const ShippingAddresses: React.FC<Props> = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>()
  const [addressToDelete, setAddressToDelete] = useState<Address | undefined>()

  const { data: addresses, isLoading, error } = useAddresses()
  const {
    mutate: deleteAddress,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteAddress({ setOpenDialog, setAddressToDelete })

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return

    return deleteAddress({ id: addressToDelete.id })
  }

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  return (
    <div className='page--select-address'>
      <h2 className='header'>Select a shipping address</h2>

      <div className='select-address'>
        <div className='select-address__existing'>
          {!addresses || addresses.length === 0 ? (
            <p className='paragraph'>No address, please add one.</p>
          ) : (
            addresses.map((address, index) => (
              <ShippingAddress
                key={index}
                address={address}
                setAddressToEdit={setAddressToEdit}
                setOpenDialog={setOpenDialog}
                setAddressToDelete={setAddressToDelete}
              />
            ))
          )}
        </div>

        <div className='select-address__add-new'>
          <h3 className='header'>Add a new address</h3>

          <AddAndEditAddress
            user={undefined}
            addressToEdit={addressToEdit}
            setAddressToEdit={setAddressToEdit}
          />
        </div>
      </div>

      {openDialog && addressToDelete && (
        <AlertDialog
          header='Please confirm'
          message='Are you sure you want to delete this address?'
          onCancel={() => {
            setAddressToDelete(undefined)
            setOpenDialog(false)
          }}
          onConfirm={handleDeleteAddress}
          loading={deleteLoading}
          error={deleteError?.message}
        />
      )}

      {error && <p className='paragraph paragraph--error'>{error.message}</p>}
    </div>
  )
}

export default ShippingAddresses
