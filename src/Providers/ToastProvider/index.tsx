'use client'
import React from 'react'
import { Toaster } from 'react-hot-toast'

const ToastProvider = () => (
  <div className='z-[20000]'>
    <Toaster containerStyle={{ zIndex: 20000 }} />
  </div>
)

export default ToastProvider
