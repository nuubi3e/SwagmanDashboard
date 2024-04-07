import RoleRows from '@/components/rows/RoleRows'
import { getSession } from '@/lib/actions/auth.action'
import { getRoles } from '@/lib/actions/role.action'
import React from 'react'

const RoleLoader = async () => {
  const user = await getSession()
  const data = await getRoles()

  const roles = data.data?.roles || []
  const actions = data.data?.actions || []
  return (
    <RoleRows
      roles={JSON.stringify(roles)}
      actions={actions}
      curUserRoleId={user?.roleId || ''}
    />
  )
}

export default RoleLoader
