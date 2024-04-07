import UserRows from '@/components/rows/UserRows'
import { Log } from '@/lib/logs'
import { getSession } from '@/lib/server/auth'
import { getRoles, getUsers } from '@/lib/server/get-data'
import PageWrapper from '@/wrappers/PageWrapper'
import TableWrapper from '@/wrappers/TableWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Swagman | User',
  description: 'Manage All User',
}

export default async function UsersPage() {
  const user = await getSession()
  const data = await Promise.all([getUsers(), getRoles()])

  const roles = data[1].data?.roles || []
  const users =
    data[0].data?.users?.map((usr) => ({ ...usr, _id: usr._id.toString() })) ||
    []
  const actions = data[0].data?.actions || []

  Log.log(users)
  const headers = ['S.No', 'Username', 'Role']

  // onShowing headers is user has permission to perform any action
  ;(actions.includes('update') || actions.includes('remove')) &&
    headers.push('Actions')
  return (
    <PageWrapper
      btnTitle='user'
      heading='Users'
      showAddAction={actions.includes('add')}>
      <TableWrapper headers={headers}>
        <UserRows
          actions={actions}
          users={JSON.stringify(users)}
          curUserId={user?.id || ''}
          roles={JSON.stringify(roles)}
        />
      </TableWrapper>
    </PageWrapper>
  )
}
