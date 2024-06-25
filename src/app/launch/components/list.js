'use client';

export default function List({children, list, isLoading}) {

  return (
    <>

        {isLoading ? (
            <p className='card-text text-center my-2'>
                <span className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </span>          
            </p>
        ) : (list.length > 0 ? children : (
            <p className='card-text text-center my-2 fw-semibold'>
                No Data
            </p>
        ))}

    </>

  )
}

