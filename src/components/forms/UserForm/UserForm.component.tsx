'use client'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook'
import { UserPayload } from '@/lib/types/payload.types'
import FormWrapper from '@/wrappers/FormWrapper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuLoader } from 'react-icons/lu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { newUserAction, updateUserAction } from '@/lib/actions/user.action'
import toast from 'react-hot-toast'
import { userActions } from '@/lib/redux/features/userSlice'
import { CTAddEditForms } from '@/lib/types/client.types'
import { Log } from '@/lib/logs'
let count = 1

const UserForm: CTAddEditForms = ({ closeModal, mode, id }) => {
  const userData = useAppSelector((st) => st.users)
  const rolesData = useAppSelector((st) => st.roles)
  const [submitting, setSubmitting] = useState(false)
  const isPrefilled = useRef(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    trigger,
  } = useForm<UserPayload>()
  const dispatch = useAppDispatch()

  const userSubmitHandler = async (user: UserPayload) => {
    setSubmitting(true)
    try {
      const res = await (mode === 'add'
        ? newUserAction(user)
        : updateUserAction(id!, user))

      if (!res.ok) throw new Error(res.message)

      mode === 'add'
        ? dispatch(userActions.addUser(res.data!.user))
        : dispatch(userActions.updateUser(res.data!.user))

      toast.success(res.message)
      closeModal()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // prefilling all data on edit mode
  const curUser =
    mode === 'edit' ? userData.users.find((user) => user._id === id) : null
  if (curUser && !isPrefilled.current) {
    setValue('username', curUser.username)
    setValue('fullName', curUser.fullName)
    setValue('displayPic', curUser.displayPic)
    setValue('roleId', curUser.roleId)
    isPrefilled.current = true
  }

  if (!watch('roleId') && mode === 'edit' && curUser) {
    setValue('roleId', curUser.roleId)
  }

  Log.log(`Render Count: ${count}`, curUser)

  count += 1

  return (
    <FormWrapper closeModal={closeModal} title={`${mode} User`}>
      <form
        onSubmit={handleSubmit(userSubmitHandler)}
        className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='fullName' className='font-medium self-start'>
            Full Name:
          </label>
          <input
            type='text'
            id='fullName'
            {...register('fullName', {
              required: 'name is required',
              minLength: {
                value: 4,
                message: 'name must contain more than 4 letters',
              },
            })}
            className='w-full py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'
            placeholder='Alex Jonas'
          />
          {errors.fullName && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='username' className='font-medium self-start'>
            Username:
          </label>
          <input
            type='text'
            id='username'
            {...register('username', {
              required: 'username is required',
              minLength: {
                value: 4,
                message: 'username must contain more than 4 letters',
              },
            })}
            className='w-full py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'
            placeholder='admin'
          />
          {errors.username && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.username.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='roleId' className='font-medium self-start'>
            Role:
          </label>
          <input
            id='roleId'
            {...register('roleId', {
              required: 'role is required',
            })}
            className='hidden'
          />
          <Select
            value={watch('roleId')}
            onValueChange={(roleVal) => {
              setValue('roleId', roleVal)

              trigger('roleId')
            }}>
            <SelectTrigger className='w-full capitalize py-2 px-3 bg-transparent outline-none  transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'>
              <SelectValue placeholder='Select Role' className='capitalize' />
            </SelectTrigger>
            <SelectContent className='z-[10001] bg-darkSec shadow-lg text-lightPr border-none'>
              <SelectGroup className='capitalize'>
                <SelectLabel>Roles</SelectLabel>
                {rolesData.roles.map((role) => (
                  <SelectItem value={role._id} key={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.roleId && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.roleId.message}
            </span>
          )}
        </div>

        {mode === 'add' && (
          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='font-medium self-start'>
              Password:
            </label>
            <input
              type='password'
              id='password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password length must be more than 8 characters',
                },
              })}
              className='w-full py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'
              placeholder='xxxxxxxx'
            />
            {errors.password && (
              <span className='text-sm text-red-500 font-medium'>
                {errors.password.message}
              </span>
            )}
          </div>
        )}
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

export default UserForm
