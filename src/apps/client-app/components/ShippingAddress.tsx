import React from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../../../components/Button'
import { useCart } from '../hooks/useCart'
import { useSelectAddress } from '../hooks/useSelectAddress'
import { Address } from '../../../types'

export const address_key = 'awesome_shippingAddress'

interface Props {
  address: Address
  setAddressToEdit: (address: Address | undefined) => void
  setOpenDialog: (open: boolean) => void
  setAddressToDelete: (address: Address | undefined) => void
}

const ShippingAddress: React.FC<Props> = ({
  address,
  setAddressToEdit,
  setOpenDialog,
  setAddressToDelete,
}) => {
  const { id, fullname, address1, address2, city, zip_code, phone } = address

  const { data: cart } = useCart()
  const { mutate: selectAddress, isLoading } = useSelectAddress()

  const history = useHistory()

  // useEffect(() => {
  //   if (isSuccess)
  //     // Call checkout endpoint
  //     history.push({
  //       pathname: '/payment/checkout',
  //       state: cart,
  //     })
  // }, [isSuccess])

  const handleSelectAddress = () => {
    if (!cart) return

    if (cart.shipping_address?.id === id) {
      // The selected address is already saved to the cart
      return history.push({
        pathname: '/payment/checkout',
        state: cart,
      })
    } else {
      return selectAddress({
        addressId: id,
      })
    }
  }

  return (
    <div className='shipping-address'>
      <div className='shipping-address__detail'>
        <h4 className='header'>{fullname}</h4>
        <p className='paragraph'>{address1}</p>
        {address2 && <p className='paragraph'>{address2}</p>}
        <p className='paragraph'>{city}</p>
        <p className='paragraph'>{zip_code}</p>
        <p className='paragraph'>{phone}</p>
      </div>

      <Button
        width='100%'
        className='btn--orange'
        style={{ margin: '1rem 0' }}
        onClick={handleSelectAddress}
        disabled={isLoading}
        loading={isLoading}
      >
        Deliver to this address
      </Button>

      <div className='shipping-address__edit'>
        <FontAwesomeIcon
          icon={['fas', 'edit']}
          size='1x'
          style={{ cursor: 'pointer' }}
          onClick={() => setAddressToEdit(address)}
        />

        <FontAwesomeIcon
          icon={['fas', 'trash-alt']}
          size='1x'
          color='red'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setAddressToDelete(address)
            setOpenDialog(true)
          }}
        />
      </div>
    </div>
  )
}

export default ShippingAddress
