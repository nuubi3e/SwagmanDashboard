export const TableRowSkeleton = ({
  column,
  rows,
}: {
  rows: number
  column: number
}) => {
  const columnsJSX = Array.from({ length: column }).map((_, i) => (
    <td className='p-4 text-left' key={`col-${i}`}>
      <span className='bg-darkTxtFade bg-opacity-50 animate-pulse w-full rounded-full h-3 block' />
    </td>
  ))

  const rowJSX = Array.from({ length: rows }).map((_, i) => (
    <tr key={`rows-${i}`}>{columnsJSX}</tr>
  ))

  return rowJSX
}

export const LeftNavSkeleton = ({ count }: { count: number }) => {
  const navJSX = Array.from({ length: count }).map((_, i) => (
    <li
      className='w-[227px] h-[45px] flex justify-center items-center px-10 gap-3'
      key={`nav-${i}`}>
      <p className='aspect-square h-[40%] rounded-full bg-darkTxtFade bg-opacity-50 animate-pulse' />
      <p className='w-full h-[30%] rounded-full bg-darkTxtFade bg-opacity-50 animate-pulse' />
    </li>
  ))

  return navJSX
}
