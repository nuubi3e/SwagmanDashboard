'use client'
import React, { ReactNode } from 'react'
import { BiX } from 'react-icons/bi'
import { motion as m } from 'framer-motion'

const FormWrapper = ({
  closeModal,
  title,
  children,
}: {
  closeModal: () => void
  title: string
  children: ReactNode
}) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed top-0 left-0 bg-black z-[10000] w-[100dvw] h-[100dvh] bg-opacity-50 backdrop-blur-[3px] text-lightPr'>
      <div className='w-full h-full overflow-y-scroll cus_scrollbar px-5 py-10'>
        <m.section
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className='w-[900px] mx-auto bg-darkSec rounded-lg shadow-lg py-7 px-9 flex flex-col gap-10 text-lightPr max-[950px]:w-full relative'>
          <button
            type='button'
            onClick={closeModal}
            className='outline-none border flex items-center w-6 aspect-square justify-center text-lightPr absolute top-4 right-4 rounded-md transition-all hover:bg-lightPr hover:text-darkPr'>
            <BiX className='text-2xl' />
          </button>
          <h3 className='text-3xl font-bold capitalize'> {title}</h3>

          {children}
        </m.section>
      </div>
    </m.div>
  )
}

export default FormWrapper
