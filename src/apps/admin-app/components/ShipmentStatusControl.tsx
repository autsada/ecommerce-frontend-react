import React, { useState, ChangeEvent, useEffect } from 'react'

import Button from '../../../components/Button'
import { useUpdateOrder } from '../hooks/useUpdateOrder'
import { OrderDetail, ShipmentStatus } from '../../../types'
import { shipmentStatuses } from '../../../utils/helpers'

interface Props {
  order: OrderDetail
}

const ShipmentStatusControl: React.FC<Props> = ({
  order: { id, shipment_status },
}) => {
  const [newStatus, setNewStatus] = useState<ShipmentStatus | undefined>()

  const { mutate: updateOrder, isLoading, error } = useUpdateOrder(id)

  useEffect(() => {
    setNewStatus(shipment_status)
  }, [shipment_status])

  useEffect(() => {
    if (error) {
      setNewStatus((prev) => prev)
      alert(error.message)
    }
  }, [error])

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setNewStatus(e.target.value as ShipmentStatus)

  const handleUpdateOrder = () => {
    if (!newStatus || newStatus === shipment_status) return

    return updateOrder({ shipmentStatus: newStatus })
  }

  return (
    <div className='shipment-status'>
      <select
        name='status'
        className='status-action'
        value={newStatus}
        onChange={handleStatusChange}
      >
        {shipmentStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <Button
        width='40%'
        className='btn--orange'
        loading={isLoading}
        disabled={isLoading || newStatus === shipment_status}
        onClick={handleUpdateOrder}
      >
        Update
      </Button>
    </div>
  )
}

export default ShipmentStatusControl
