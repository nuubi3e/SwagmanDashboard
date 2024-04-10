'use client'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const ToastProvider = () => (
  <div className='z-[99999]'>
    <Toaster containerStyle={{ zIndex: 99999 }} />
  </div>
)

export default ToastProvider

const Success = (message: string) => {
  toast((t) => <div className={`bg-red-500 p-10`}>hello</div>, {
    duration: 10000,
    position: 'top-right',
    style: { padding: '0', margin: '0' },
  })
}

export const CusToast = { Success }
