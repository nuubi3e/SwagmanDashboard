'use client'
import { Log } from '@/lib/logs'
import { usePathname } from 'next/navigation'
import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'

/*
- IF some person changes the httponly cookie from the browser then that will become normal cookie and become accessible using client JS so we check for that if that will be the case then we will expire that cookie and reloads the page.
- Component to keep track of cookie for manual alternation
*/
const AuthChecker: FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    Log.log('Checking....')
    const cookie = document.cookie
    const authToken = cookie.split('=')[0]

    if (authToken && authToken === 'auth') {
      document.cookie = `auth=aa; expires=${new Date(0)}`
    }
  }, [pathname])

  return <></>
}

export default AuthChecker
