import LeftNavbar from '@/components/LeftNavbar/LeftNavbar.component';
import TopBar from '@/components/TopBar/TopBar.component';
import { Log } from '@/lib/logs';
import { PERMISSIONTYPE } from '@/lib/utils/global.utils';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  console.clear();
  const cookie = cookies().get('auth')?.value;
  let permissions: PERMISSIONTYPE[] = [];

  try {
    Log.log(cookie);
    Log.log(`${process.env.NEXT_URL}api/permissions`);

    // Calling api to get permissions
    const res = await fetch(`${process.env.NEXT_URL}api/permissions`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      const error = JSON.parse(await res.text());
      throw new Error(error.message);
    }

    const data = await res.json();

    permissions = data?.data?.permissions || [];
  } catch (err) {
    Log.error(err);
  }

  return (
    <>
      {/* <article className='w-full bg-orange-400 py-3 font-medium text-orange-50 flex items-center justify-center gap-1'>
        This User only have access to add Data! For help contact
        <strong className='underline capitalize'>admin</strong>
      </article> */}
      <div className='flex relative bg-darkPr'>
        <LeftNavbar permissions={permissions} />
        <section className='flex-1 relative min-h-[100dvh]'>
          <TopBar />
          <main>{children}</main>
        </section>
      </div>
    </>
  );
}
