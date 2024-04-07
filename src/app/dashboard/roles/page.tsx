import RoleRows from '@/components/rows/RoleRows'
import { getSession } from '@/lib/server/auth'
import { getRoles } from '@/lib/server/get-data'
import PageWrapper from '@/wrappers/PageWrapper'
import TableWrapper from '@/wrappers/TableWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Swagman | Roles',
  description: 'Manage User Roles',
}

export default async function RolesPage() {
  const data = await getRoles()
  const user = await getSession()

  const actions = data.data?.actions || []
  const roles = data.data?.roles || []

  const headers = [
    'S.No',
    'Role Name',
    'Permissions',
    'Created At',
    'Last Updated',
  ]

  // onShowing headers is user has permission to perform any action
  ;(actions.includes('update') || actions.includes('remove')) &&
    headers.push('Actions')
  return (
    <>
      <PageWrapper
        btnTitle='role'
        heading='Roles'
        showAddAction={actions.includes('add')}>
        <TableWrapper headers={headers}>
          {/* <Suspense
            fallback={<TableRowSkeleton column={headers.length} rows={3} />}>
            <RoleLoader />
          </Suspense> */}
          <RoleRows
            roles={JSON.stringify(roles)}
            actions={actions}
            curUserRoleId={user?.roleId || ''}
          />
        </TableWrapper>
      </PageWrapper>
    </>
  )
}
