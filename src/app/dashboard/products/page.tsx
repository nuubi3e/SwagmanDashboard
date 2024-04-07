import ProductRows from '@/components/rows/ProductRows'
import { Log } from '@/lib/logs'
import { getProducts } from '@/lib/server/get-data'
import PageWrapper from '@/wrappers/PageWrapper'
import TableWrapper from '@/wrappers/TableWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Swagman | Products',
  description: 'Manage All Swagmans Products',
}

export default async function ProductsPage() {
  const data = await getProducts()

  const products = data.data?.products || []
  const actions = data.data?.actions || []

  Log.log('Products: ', data)

  const headers = [
    'S.No',
    'Product Name',
    'Price',
    'Reviews',
    'Rating',
    'Last Updated',
  ]

  // onShowing headers is user has permission to perform any action
  ;(actions.includes('update') || actions.includes('remove')) &&
    headers.push('Actions')
  return (
    <PageWrapper
      btnTitle='product'
      heading='Products'
      showAddAction={actions.includes('add')}>
      <TableWrapper headers={headers}>
        <ProductRows actions={actions} products={JSON.stringify(products)} />
      </TableWrapper>
    </PageWrapper>
  )
}
