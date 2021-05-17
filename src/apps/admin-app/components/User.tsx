import React, { useState, useEffect, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../../../components/Button'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { User, Role } from '../../../types'
import { formatDate } from '../../../utils/helpers'

interface Props {
  user: User
  admin: User
  setOpenDialog: (open: boolean) => void
  setUserToDelete: (user: User | null) => void
}

const SingleUser: React.FC<Props> = ({
  user,
  admin,
  setOpenDialog,
  setUserToDelete,
}) => {
  const { id, username, email, created_at, role } = user
  const [newRole, setNewRole] = useState<Role>()
  const [isEditing, setIsEditing] = useState(false)

  const {
    mutate: updateUser,
    isLoading,
    error,
  } = useUpdateUser(id, setIsEditing)

  useEffect(() => {
    setNewRole(role)
  }, [role])

  useEffect(() => {
    if (error) alert(error.message)
  }, [error])

  const handleUpdateUser = () => {
    if (!newRole || newRole === role) return

    return updateUser({ role: newRole })
  }

  return (
    <tr>
      {/* User name */}
      <td className='table-cell' style={{ width: '15%' }}>
        {username}
      </td>

      {/* Email */}
      <td className='table-cell' style={{ width: '20%' }}>
        {email}
      </td>

      {/* CreatedAt */}
      <td className='table-cell'>{formatDate(created_at)}</td>

      {/* Role - Client */}
      <td className='table-cell'>
        {newRole === 'CLIENT' ? (
          <FontAwesomeIcon
            icon={['fas', 'check-circle']}
            style={{
              cursor: isEditing ? 'pointer' : undefined,
              color: isEditing ? 'green' : undefined,
            }}
            size='1x'
          />
        ) : isEditing ? (
          <FontAwesomeIcon
            icon={['fas', 'times-circle']}
            style={{
              cursor: 'pointer',
              color: 'red',
            }}
            size='1x'
            onClick={() => setNewRole('CLIENT')}
          />
        ) : (
          ''
        )}
      </td>

      {/* Role - Admin */}
      <td className='table-cell'>
        {newRole === 'ADMIN' ? (
          <FontAwesomeIcon
            icon={['fas', 'check-circle']}
            style={{
              cursor: isEditing ? 'pointer' : undefined,
              color: isEditing ? 'green' : undefined,
            }}
            size='1x'
          />
        ) : isEditing ? (
          <FontAwesomeIcon
            icon={['fas', 'times-circle']}
            style={{
              cursor: 'pointer',
              color: 'red',
            }}
            size='1x'
            onClick={() => setNewRole('ADMIN')}
          />
        ) : (
          ''
        )}
      </td>

      {/* Role - Super Admin */}
      <td className='table-cell'>
        {role === 'SUPER_ADMIN' ? (
          <FontAwesomeIcon icon={['fas', 'check-circle']} size='1x' />
        ) : (
          ''
        )}
      </td>

      {/* Edit */}
      {admin.role === 'SUPER_ADMIN' && (
        <>
          <td className='table-cell'>
            {role !== 'SUPER_ADMIN' && (
              <>
                {!isEditing ? (
                  <FontAwesomeIcon
                    icon={['fas', 'edit']}
                    size='1x'
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsEditing(true)}
                  />
                ) : (
                  <div className='table__update-action'>
                    <Button
                      width='40%'
                      height='2rem'
                      className='btn--cancel'
                      style={{ fontSize: '1rem' }}
                      onClick={() => {
                        setNewRole(role)
                        setIsEditing(false)
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>

                    <Button
                      width='40%'
                      height='2rem'
                      className='btn--confirm'
                      style={{ fontSize: '1rem' }}
                      onClick={handleUpdateUser}
                      loading={isLoading}
                      spinnerHeight={10}
                      spinnerWidth={10}
                      disabled={isLoading || role === newRole}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </>
            )}
          </td>

          <td className='table-cell' style={{ width: '6%' }}>
            {role !== 'SUPER_ADMIN' && (
              <FontAwesomeIcon
                icon={['fas', 'trash-alt']}
                size='1x'
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => {
                  setOpenDialog(true)
                  setUserToDelete(user)
                }}
              />
            )}
          </td>
        </>
      )}
    </tr>
  )
}

export default memo(SingleUser)
