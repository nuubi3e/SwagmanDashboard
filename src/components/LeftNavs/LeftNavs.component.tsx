import React from 'react';
import { ActiveLink } from '../ActiveLink';
import { PERMISSIONTYPE } from '@/lib/utils/global.utils';
import { MdSpaceDashboard } from 'react-icons/md';
import { LuPackagePlus } from 'react-icons/lu';
import { FaListUl, FaUserGear } from 'react-icons/fa6';
import { HiUsers } from 'react-icons/hi';
import { BiSolidPackage } from 'react-icons/bi';

const routes: {
  icon: JSX.Element;
  title: PERMISSIONTYPE | 'dashboard';
}[] = [
  {
    icon: <MdSpaceDashboard className='text-lg' />,
    title: 'dashboard',
  },
  {
    icon: <LuPackagePlus className='text-lg' />,
    title: 'products',
  },
  {
    icon: <FaListUl className='text-lg' />,
    title: 'categories',
  },
  {
    icon: <HiUsers className='text-lg' />,
    title: 'users',
  },
  {
    icon: <BiSolidPackage className='text-lg' />,
    title: 'orders',
  },
  {
    icon: <FaUserGear className='text-lg' />,
    title: 'roles',
  },
];
const LeftNavs = ({ permissions }: { permissions: PERMISSIONTYPE[] }) => {
  // new object for creating routes based on permissions
  const newRoutes: {
    href: string;
    icon: JSX.Element;
    title: PERMISSIONTYPE | 'dashboard';
  }[] = [
    {
      href: '/dashboard',
      icon: <MdSpaceDashboard className='text-lg' />,
      title: 'dashboard',
    },
  ];

  routes.forEach((route) => {
    // checking permission for each route
    const hasPermission = permissions.includes(route.title as PERMISSIONTYPE);

    if (!hasPermission) return;

    // only pushing routes which uses has permission
    newRoutes.push({ ...route, href: `/dashboard/${route.title}` });
  });

  return (
    <>
      {newRoutes.map((route) => (
        <li key={route.href} className='w-full'>
          <ActiveLink
            href={route.href}
            className={`pl-10 pr-12 py-3 capitalize rounded-tr-full font-medium rounded-br-full flex items-center gap-3 mr-7 transition-all`}
            commonStyles='text-darkTxtFade hover:text-lightPr'
            activeStyles='bg-lightPr text-darkBg '>
            {route.icon}
            {route.title}
          </ActiveLink>
        </li>
      ))}
    </>
  );
};

export default LeftNavs;
