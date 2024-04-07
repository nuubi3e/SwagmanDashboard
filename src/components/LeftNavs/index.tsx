import React from 'react'
import { ActiveLink } from '../ActiveLink'
import { PERMISSIONTYPE } from '@/lib/utils/global.utils'
import { MdSpaceDashboard } from 'react-icons/md'
import { LuPackagePlus } from 'react-icons/lu'
import { FaListUl, FaUserGear } from 'react-icons/fa6'
import { HiUsers } from 'react-icons/hi'
import { BiSolidPackage } from 'react-icons/bi'
import { cookies } from 'next/headers'
import { Log } from '@/lib/logs'

const routes: {
  icon: JSX.Element
  title: PERMISSIONTYPE | 'dashboard'
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
]
const LeftNavs = async () => {
  await new Promise((res, _) => setTimeout(res, 5000))
  const cookie = cookies().get('auth')?.value

  // new object for creating routes based on permissions
  const newRoutes: {
    href: string
    icon: JSX.Element
    title: PERMISSIONTYPE | 'dashboard'
  }[] = [
    {
      href: '/dashboard',
      icon: <MdSpaceDashboard className='text-lg' />,
      title: 'dashboard',
    },
  ]

  try {
    // Calling api to get permissions
    const res = await fetch(`${process.env.NEXT_URL}/api/permissions`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    })

    if (!res.ok) {
      const error = JSON.parse(await res.text())
      throw new Error(error.message)
    }

    const data = await res.json()

    const permissions: PERMISSIONTYPE[] = data?.data?.permissions || []

    routes.forEach((route) => {
      // checking permission for each route
      const hasPermission = permissions.includes(route.title as PERMISSIONTYPE)

      if (!hasPermission) return

      newRoutes.push({ ...route, href: `/dashboard/${route.title}` })
    })
  } catch (err) {
    Log.error(err)
  }

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
  )
}

export default LeftNavs
