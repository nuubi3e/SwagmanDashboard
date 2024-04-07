import { NewActionButton } from '@/components/Buttons'
import { FORMTYPES } from '@/lib/types/client.types'
import React, { FC, ReactNode } from 'react'

interface PageWrapperProps {
  btnTitle: FORMTYPES
  children: ReactNode
  showAddAction: boolean
  heading: string
}

const PageWrapper: FC<PageWrapperProps> = ({
  btnTitle,
  children,
  showAddAction,
  heading,
}) => {
  return (
    <section className='text-lightPr py-10 px-14 flex flex-col gap-10'>
      <div className='flex items-center justify-between'>
        <h2 className='font-semibold text-5xl capitalize'>{heading}</h2>

        {showAddAction && <NewActionButton title={btnTitle} />}
      </div>

      {/* TABLES */}
      {children}
    </section>
  )
}

export default PageWrapper
