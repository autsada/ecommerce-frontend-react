import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import Spinner from '../../../components/Spinner'
import Pagination from '../../../components/Pagination'
import AlertDialog from '../../../components/AlertDialog'
import SingleUser from '../components/User'
import { useAppSelector } from '../../../store/store'
import { selectAuth } from '../../../store/slices/authSlice'
import { useUsers } from '../hooks/useUsers'
import { useDeleteUser } from '../hooks/useDeleteUser'
import { User } from '../../../types'

const usersPerPage = +process.env.REACT_APP_USERS_PER_PAGE!

interface Props {}

const ManageUsers: React.FC<Props> = () => {
  const { user: admin } = useAppSelector(selectAuth)
  const [page, setPage] = useState(1)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const [openDialog, setOpenDialog] = useState(false)
  const { data, isLoading, error, isPreviousData } = useUsers(
    page,
    usersPerPage
  )
  const {
    mutate: deleteUser,
    isLoading: deleteUserLoading,
    error: deleteUserError,
  } = useDeleteUser({ setOpenDialog, setUserToDelete })

  const handleDeleteUser = () => {
    if (!userToDelete) return

    return deleteUser({ userId: userToDelete.id })
  }

  if (!admin) return <Redirect to='/products' />

  if (isLoading) return <Spinner color='grey' height={50} width={50} />

  if (error) return <h2 className='header--center'>{error.message}</h2>

  if (!data?.users || data.users.length === 0)
    return <h2 className='header--center'>No users.</h2>

  return (
    <div className='page--manage-users'>
      <h2 className='header--center'>Manage users</h2>

      {data.totalQueries > 0 && (
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

      <table className='table table--manage-users'>
        <thead>
          <tr>
            {/* Header */}
            <th className='table-cell' style={{ width: '15%' }} rowSpan={2}>
              Name
            </th>
            <th className='table-cell' style={{ width: '20%' }} rowSpan={2}>
              Email
            </th>
            <th className='table-cell' rowSpan={2}>
              Created At
            </th>

            <th className='table-cell' style={{ width: '25%' }} colSpan={3}>
              Role
            </th>

            <th className='table-cell' rowSpan={2}>
              Edit
            </th>

            <th className='table-cell' style={{ width: '6%' }} rowSpan={2}>
              Delete
            </th>
          </tr>

          {/* Sub header */}
          <tr>
            <th className='table-cell'>Client</th>
            <th className='table-cell'>Admin</th>
            <th className='table-cell'>Super</th>
          </tr>
        </thead>

        <tbody>
          {data.users.map((user) => (
            <SingleUser
              key={user.id}
              user={user}
              admin={admin}
              setOpenDialog={setOpenDialog}
              setUserToDelete={setUserToDelete}
            />
          ))}
        </tbody>
      </table>

      {openDialog && userToDelete && (
        <AlertDialog
          header='Please confirm'
          message={`Are you sure you want to delete this user: ${userToDelete.username}?`}
          onCancel={() => {
            setOpenDialog(false)
            setUserToDelete(null)
          }}
          onConfirm={handleDeleteUser}
          loading={deleteUserLoading}
          error={deleteUserError?.message}
        />
      )}
    </div>
  )
}

export default ManageUsers
