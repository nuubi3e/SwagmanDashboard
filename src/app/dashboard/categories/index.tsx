import CategoryRows from '@/components/rows/CategoryRows'
import { getCategories } from '@/lib/server/get-data'
import { ACTIONTYPE } from '@/lib/utils/global.utils'

interface CategoriesProps {
  actions: ACTIONTYPE[]
  searchStr: string
}

const Categories = async ({ actions, searchStr }: CategoriesProps) => {
  const data = await getCategories(searchStr)

  const categories = data.data?.categories || []

  return (
    <>
      <CategoryRows
        actions={actions}
        categories={JSON.stringify(categories)}
        searchStr={searchStr}
      />
    </>
  )
}

export default Categories
