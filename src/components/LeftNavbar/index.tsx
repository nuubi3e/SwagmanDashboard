import React, { Suspense } from 'react'
import { SwagmanLogo } from '../icons/Logos'
import LeftNavs from '../LeftNavs'
import { LogOutBtn } from '../Buttons'
import { LeftNavSkeleton } from '../Skeletons'
import dynamic from 'next/dynamic'
const ResponsiveLeftNavWrapper = dynamic(
  () => import('@/wrappers/ResponsiveLeftNavWrapper'),
  { ssr: false }
)



const LeftNavbar = async () => {
  return (
    <ResponsiveLeftNavWrapper>
      <div className='flex justify-center mb-10 my-5'>
        <SwagmanLogo className='fill-white h-24' />
      </div>

      <nav className='overflow-hidden flex-1'>
        <ul className='h-full overflow-y-scroll cus_scrollbar flex flex-col items-start'>
          <Suspense fallback={<LeftNavSkeleton count={5} />}>
            <LeftNavs />
          </Suspense>
        </ul>
      </nav>

      {/* actions */}
      <div className='py-2 w-full flex flex-col mt-auto'>
        <LogOutBtn />
      </div>
    </ResponsiveLeftNavWrapper>
  )
}

export default LeftNavbar
