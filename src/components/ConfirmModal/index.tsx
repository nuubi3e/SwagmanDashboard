'use client'
import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'
import { motion as m } from 'framer-motion'

interface ConfirmModalProps {
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  note?: string
}

const ConfirmModal = ({
  onClose,
  onConfirm,
  loading,
  note,
}: ConfirmModalProps) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed top-0 left-0 bg-black z-[10000] w-[100dvw] h-[100dvh] bg-opacity-20 backdrop-blur-[1px] text-lightPr p-5'>
      <m.section
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className='w-[600px] mx-auto bg-darkSec items-center rounded-lg shadow-lg py-4 px-5 flex flex-col gap-5 text-lightPr max-[950px]:w-full relative'>
        <div className='flex items-center gap-2 flex-col'>
          <FaExclamationCircle className='text-5xl' />
          <h2 className='text-base gap-1 flex flex-col text-center'>
            <em>
              {`"`} Deleting this is like feeding it to the digital dragons.
              Once it{`'`}s gone, there{`'`}s no getting it back. {`"`}
            </em>
            <strong className='text-3xl'>Are you brave enough🤨?</strong>
          </h2>
          {note && (
            <strong className='text-red-500 text-sm self-stretch text-right'>
              ** Caution: {note} **
            </strong>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            disabled={loading}
            onClick={onConfirm}
            className='bg-darkTxtFade capitalize text-white rounded-full px-5 py-2 transition-all hover:bg-darkTxtFade disabled:cursor-not-allowed'>
            confirm{loading ? 'ing...' : ''}
          </button>
          <button
            type='button'
            disabled={loading}
            onClick={onClose}
            className='bg-darkTxtFade transition-all bg-opacity-50 capitalize text-white rounded-full px-5 py-2 hover:bg-opacity-80 disabled:cursor-not-allowed'>
            cancel
          </button>
        </div>
      </m.section>
    </m.div>
  )
}

export default ConfirmModal
