'use client'
import { roleAcions } from '@/lib/redux/features/roleSlice'
import { userActions } from '@/lib/redux/features/userSlice'
import { useAppSelector, useAppStore } from '@/lib/redux/hook'
import { getActionCP } from '@/lib/utils/client.utils'
import { ACTIONTYPE } from '@/lib/utils/global.utils'
import React, { useRef } from 'react'

const UserRows = ({
  actions,
  users,
  curUserId,
  roles,
}: {
  users: string
  actions: ACTIONTYPE[]
  curUserId: string
  roles: string
}) => {
  const parsedUsers = JSON.parse(users)
  const parsedRoles = JSON.parse(roles)

  // CODE to store roles in redux-store
  const initializedData = useRef(false)
  const store = useAppStore()
  if (!initializedData.current) {
    store.dispatch(userActions.storeUsers(parsedUsers))
    store.dispatch(roleAcions.storeRoles(parsedRoles))
    initializedData.current = true
  }

  const userData = useAppSelector((st) => st.users)

  const ActionJSX = getActionCP(actions)

  return (
    <>
      {userData.users.length > 0 &&
        userData.users.map((user, i) => (
          <tr key={user._id.toString()}>
            <td className='py-5 px-4 text-left'>{i + 1}</td>
            <td className='py-5 px-4 text-left'>{user.username}</td>
            <td className='py-5 px-4 text-left'>{user.role}</td>
            <td className='py-5 px-4 text-left'>
              <p className='flex items-center gap-2'>
                {ActionJSX.map(
                  (JSX, i) =>
                    JSX && (
                      <JSX
                        key={i}
                        id={user._id}
                        title='user'
                        curUserId={curUserId}
                      />
                    )
                )}
              </p>
            </td>
          </tr>
        ))}
    </>
  )
}

export default UserRows
