import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { LeftNavToggleBtn } from '../Buttons'
import { getSession } from '@/lib/server/auth'
import SearchBar from '../SearchBar'

const TopBar = async () => {
  const user = await getSession()

  return (
    <header className='sticky top-0 right-0 w-full pt-7 pb-5 px-14 flex items-center text-lightPr bg-darkPr max-lg:px-6 max-lg:gap-5'>
      <LeftNavToggleBtn />
      <SearchBar />

      <div className='ml-auto flex items-center gap-3'>
        <p className='ml-auto'>{user?.name}</p>
        <figure className='w-8 aspect-square rounded-full bg-darkTxtFade'></figure>
      </div>
    </header>
  )
}

export default TopBar
