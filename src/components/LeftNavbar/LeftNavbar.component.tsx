import React, { Suspense } from 'react';
import { SwagmanLogo } from '../icons/Logos/Logos';
import LeftNavs from '../LeftNavs/LeftNavs.component';
import { LogOutBtn } from '../Buttons';

import dynamic from 'next/dynamic';
import { PERMISSIONTYPE } from '@/lib/utils/global.utils';
const ResponsiveLeftNavWrapper = dynamic(
  () => import('@/wrappers/ResponsiveLeftNavWrapper'),
  { ssr: false }
);

const LeftNavbar = async ({
  permissions,
}: {
  permissions: PERMISSIONTYPE[];
}) => {
  return (
    <ResponsiveLeftNavWrapper>
      <div className='flex justify-center mb-10 my-5'>
        <SwagmanLogo className='fill-white h-24' />
      </div>

      <nav className='overflow-hidden flex-1'>
        <ul className='h-full overflow-y-scroll cus_scrollbar flex flex-col items-start'>
          <LeftNavs permissions={permissions} />
        </ul>
      </nav>

      {/* actions */}
      <div className='py-2 w-full flex flex-col mt-auto'>
        <LogOutBtn />
      </div>
    </ResponsiveLeftNavWrapper>
  );
};

export default LeftNavbar;
