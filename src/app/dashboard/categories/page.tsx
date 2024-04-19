import { getActions } from '@/lib/server/auth';
import PageWrapper from '@/wrappers/PageWrapper';
import TableWrapper from '@/wrappers/TableWrapper';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Categories from '.';
import { TableRowSkeleton } from '@/components/Skeletons/Skeletions';
import { Log } from '@/lib/logs';

export const metadata: Metadata = {
  title: 'Swagman | Categories',
  description: 'Manage Product Categories',
};

interface CategoriesPageProps {
  searchParams: {
    page: number;
    item: string;
  };
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  Log.log(searchParams);

  const actions = await getActions('categories');

  const headers = ['S No', 'Name', 'History'];

  // onShowing headers is user has permission to perform any action
  (actions.includes('update') || actions.includes('remove')) &&
    headers.push('Actions');

  return (
    <PageWrapper
      btnTitle='category'
      heading='Categories'
      showAddAction={actions.includes('add')}>
      <TableWrapper headers={headers}>
        <Suspense
          key={searchParams.item}
          fallback={<TableRowSkeleton rows={3} column={headers.length} />}>
          <Categories actions={actions} searchStr={searchParams.item || ''} />
        </Suspense>
      </TableWrapper>
    </PageWrapper>
  );
}
