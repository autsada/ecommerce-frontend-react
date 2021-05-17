interface Props {
  page: number
  setPage: (page: number) => void
  totalPages: number
  hasMore: boolean
  isPreviousData: boolean
}

const Pagination = ({
  page,
  setPage,
  totalPages,
  hasMore,
  isPreviousData,
}: Props) => {
  return (
    <div className='pagination'>
      <div
        className='pagination__page'
        style={{ cursor: page === 1 ? 'not-allowed' : undefined }}
        onClick={page > 1 ? () => setPage(page - 1) : undefined}
      >
        <p className='paragraph--center'>Prev</p>
      </div>

      <div className='page-total'>
        <p className='paragraph--center'>
          {page} of {totalPages}
        </p>
      </div>

      <div
        className='pagination__page'
        style={{
          cursor: isPreviousData || !hasMore ? 'not-allowed' : undefined,
        }}
        onClick={page < totalPages ? () => setPage(page + 1) : undefined}
      >
        <p className='paragraph--center'>Next</p>
      </div>
    </div>
  )
}

export default Pagination
