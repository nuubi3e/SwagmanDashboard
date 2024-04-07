'use client'
import { uiActions } from '@/lib/redux/features/uiSlice'
import { useAppDispatch } from '@/lib/redux/hook'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { FC, ReactNode } from 'react'
interface ActiveLinkProps {
  href: string
  className: HTMLDivElement['className']
  activeStyles: string
  commonStyles: string
  children: ReactNode
}

export const ActiveLink: FC<ActiveLinkProps> = ({
  href,
  className,
  activeStyles,
  commonStyles,
  children,
}) => {
  const dispatch = useAppDispatch()
  const curPath = usePathname()
  const isActive = curPath === href
  const classes = `${isActive ? activeStyles : commonStyles} ${className}`
  return (
    <Link
      href={href}
      className={classes}
      onClick={() => dispatch(uiActions.closeNav())}>
      {children}
    </Link>
  )
}
