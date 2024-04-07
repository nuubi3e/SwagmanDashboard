'use client'
import { categoryActions } from '@/lib/redux/features/categorySlice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook'
import {
  newCategoryAction,
  updateCategoryAction,
} from '@/lib/actions/category.action'
import { CTAddEditForms } from '@/lib/types/client.types'
import { CategoryPayload } from '@/lib/types/payload.types'
import FormWrapper from '@/wrappers/FormWrapper'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LuLoader } from 'react-icons/lu'

const CategoryForm: CTAddEditForms = ({ closeModal, mode, id }) => {
  const dispatch = useAppDispatch()
  const isPrefilled = useRef(false)
  const categories = useAppSelector((st) => st.category)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<CategoryPayload>()
  const [submitting, setSubmitting] = useState(false)

  const categorySubmitHandler = async (cat: CategoryPayload) => {
    setSubmitting(true)
    try {
      const res = await (mode === 'add'
        ? newCategoryAction(cat)
        : updateCategoryAction(cat, id!))

      if (!res.ok) throw new Error(res.message)

      mode === 'add'
        ? dispatch(categoryActions.addCategory(res.data?.category!))
        : dispatch(categoryActions.updateCategory(res.data?.category!))

      toast.success(res.message)
      closeModal()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const curCat =
    mode === 'edit' ? categories.categories.find((cat) => cat._id === id) : null
  if (!isPrefilled.current && curCat) {
    setValue('name', curCat.name)
    isPrefilled.current = true
  }

  return (
    <FormWrapper closeModal={closeModal} title={`${mode} Category`}>
      <form
        onSubmit={handleSubmit(categorySubmitHandler)}
        className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='name' className='font-medium self-start'>
            Category Name:
          </label>
          <input
            type='text'
            id='name'
            {...register('name', {
              required: 'category name is required',
              minLength: {
                value: 4,
                message: 'name must contain more than 4 letters',
              },
            })}
            className='w-full py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'
            placeholder='face care'
          />
          {errors.name && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.name.message}
            </span>
          )}
        </div>

        <button
          disabled={submitting}
          type='submit'
          className='max-md:self-stretch flex mt-3 justify-center gap-2 items-center self-start py-2 outline-none rounded-md bg-lightPr text-darkPr px-6 font-semibold focus:outline-lightPr focus:outline-offset-4 focus:outline-2 disabled:bg-darkTxtFade disabled:cursor-not-allowed'>
          Submit {submitting && <LuLoader className='animate-spin' />}
        </button>
      </form>
    </FormWrapper>
  )
}

export default CategoryForm
