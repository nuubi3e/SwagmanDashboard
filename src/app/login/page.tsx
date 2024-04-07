import { getSession } from '@/lib/actions/auth.action'
import LoginForm from './LoginForm'
import { Log } from '@/lib/logs'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { MustacheLogo, SwagmanLogo } from '@/components/icons/Logos'

interface LoginPageProps {
  searchParams: {
    redirect?: string
  }
}

export const metadata: Metadata = {
  title: 'Swagman | Login',
  description: 'Login to access Swagman | e-commerce Admin dashboard',
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession()

  Log.log(searchParams)

  Log.log(session)
  if (session) return redirect('/dashboard')

  return (
    <>
      <main className='min-h-[100dvh] bg-darkPr text-lightPr flex flex-col p-5 items-center justify-between'>
        <div className='flex flex-col items-center gap-5'>
          <MustacheLogo className='fill-lightPr h-8 mt-5' />
          <h1 className='text-4xl uppercase text-center mb-5 font-thin'>
            Swagman Login
          </h1>
        </div>

        <section className='w-[400px] max-[400px]:w-full mb-20'>
          <LoginForm redirectUrl={searchParams?.redirect || '/dashboard'} />
        </section>

        <p className='text-center text-sm'>
          &copy; Copyright {new Date().getFullYear()}
          <strong> Swagman</strong>, Design & Developed by{' '}
          <strong>Gaurav</strong>
        </p>
      </main>
    </>
  )
}
