import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Swagman | Dashboard',
  description: 'Breif info on Swagman dashboard',
}

export default function DashboardPage() {
  return (
    <>
      <h1 className='text-center text-white mt-10 text-6xl'>Dashboard Page</h1>
    </>
  )
}
