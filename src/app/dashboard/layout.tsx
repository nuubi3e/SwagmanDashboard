import LeftNavbar from '@/components/LeftNavbar'
import TopBar from '@/components/TopBar'
import { ReactNode } from 'react'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      {/* <article className='w-full bg-orange-400 py-3 font-medium text-orange-50 flex items-center justify-center gap-1'>
        This User only have access to add Data! For help contact
        <strong className='underline capitalize'>admin</strong>
      </article> */}
      <div className='flex relative bg-darkPr'>
        <LeftNavbar />
        <section className='flex-1 relative min-h-[100dvh]'>
          <TopBar />
          <main>{children}</main>
        </section>
      </div>
    </>
  )
}
