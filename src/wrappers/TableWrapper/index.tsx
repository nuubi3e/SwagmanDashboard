import React, { FC, ReactNode } from 'react'

interface TableWrapperProps {
  headers: string[]
  children: ReactNode
}

const TableWrapper: FC<TableWrapperProps> = ({ headers, children }) => {
  return (
    <section className='bg-darkTableBd rounded overflow-hidden'>
      <table className='w-full'>
        <thead className=''>
          <tr className='text-grayPr bg-darkSec text-[15px]'>
            {headers.map((header) => (
              <th className='p-3 px-4 text-left font-semibold' key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className='text-lightPr text-[15px]'>{children}</tbody>
      </table>
    </section>
  )
}

export default TableWrapper
