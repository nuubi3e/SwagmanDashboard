import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.scss'
import AuthChecker from '@/components/AuthChecker'
import ToastProvider from '@/Providers/ToastProvider'
import ReduxProvider from '@/Providers/ReduxProvider'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Swagman | E-Commerce',
  description: 'Swagman is a men centric fashon and gromming brand',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={raleway.className}>
        <ToastProvider />
        <AuthChecker />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
