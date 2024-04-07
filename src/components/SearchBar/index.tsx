'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ChangeEvent, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'

const SearchBar = () => {
  const timeout = useRef<NodeJS.Timeout>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const userInp = e.target.value.trim()
    clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)

      if (userInp) params.set('item', userInp)
      else params.delete('item')

      router.replace(`${pathname}?${params.toString()}`)
    }, 500)
  }

  return (
    <div className='flex items-center relative gap-3 bg-darkSec rounded-md py-2 px-4 w-[50%]'>
      <FiSearch className='text-darkTxtFade text-xl' />
      <input
        type='search'
        name='searchBar'
        id='searchBar'
        onChange={searchHandler}
        className='bg-transparent w-full outline-none text-lightPr placeholder:text-darkTxtFade placeholder:text-opacity-50 '
        placeholder='Search role, products, etc.'
      />
    </div>
  )
}

export default SearchBar
