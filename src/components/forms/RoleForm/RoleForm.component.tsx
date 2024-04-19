'use client'
import React, { FC, useRef, useState } from 'react'
import { BiX } from 'react-icons/bi'
import { FiPlus } from 'react-icons/fi'
import { LuEye, LuLoader, LuTrash } from 'react-icons/lu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MdAdd, MdOutlineModeEditOutline } from 'react-icons/md'
import { Log } from '@/lib/logs'
import { useForm } from 'react-hook-form'
import { PermissionPayload } from '@/lib/types/payload.types'
import {
  ACTIONTYPE,
  PERMISSIONS,
  PERMISSIONTYPE,
} from '@/lib/utils/global.utils'
import { newRoleAction, updateRoleAction } from '@/lib/actions/role.action'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook'
import { roleAcions } from '@/lib/redux/features/roleSlice'
import FormWrapper from '@/wrappers/FormWrapper'
import { generateId } from '@/lib/utils/client.utils'
import { CTAddEditForms } from '@/lib/types/client.types'

const actions: { icon: JSX.Element; value: ACTIONTYPE }[] = [
  { icon: <LuEye />, value: 'view' },
  { icon: <MdAdd className='text-xl' />, value: 'add' },
  { icon: <MdOutlineModeEditOutline className='' />, value: 'update' },
  { icon: <LuTrash />, value: 'remove' },
]

const RoleForm: CTAddEditForms = ({ closeModal, mode, id }) => {
  const isPrefilled = useRef(false)
  const roleData = useAppSelector((st) => st.roles)
  const [actionPer, setActionPer] = useState<string[]>([]) // to store action per permission
  const [submitting, setSubmitting] = useState(false) // state for showing loader on submission
  const [userPermission, setUserPermission] = useState<PermissionPayload[]>([]) // to store permission per role
  const [permission, setPermission] = useState([...PERMISSIONS]) // all permissions
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
    getValues,
  } = useForm<{ roleName: string; permission: string }>()

  // submit role and its permission to server
  const roleSubmissionHandler = async (data: {
    roleName: string
    permission: string
  }) => {
    setSubmitting(true)
    try {
      const res = await (mode === 'add'
        ? newRoleAction({
            name: data.roleName,
            permission: userPermission,
          })
        : updateRoleAction(id!, {
            name: data.roleName,
            permission: userPermission,
          }))

      if (!res.ok) throw new Error(res.message)

      Log.log(JSON.parse(res.data!.role))

      mode === 'add'
        ? dispatch(roleAcions.addRole(JSON.parse(res.data!.role)))
        : dispatch(
            roleAcions.updateRole({
              role: JSON.parse(res.data!.role),
              id: id!,
            })
          )

      toast.success(res.message)
      closeModal()
    } catch (err: any) {
      Log.error(err)
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const addUserPermissionHandler = () => {
    const permissionVal = getValues('permission')

    // add user permission
    setUserPermission((lstPer) => {
      const userPer = [...lstPer]
      const per: PermissionPayload = {
        actions: actionPer,
        id: generateId(),
        name: permissionVal,
      }

      userPer.push(per)
      return userPer
    })
    // reseting permission
    setValue('permission', '')
    // resetting action
    setActionPer([])

    // removing assigned permission to avoid duplication
    setPermission((lstPer) => {
      const per = [...lstPer]
      const index = per.findIndex((p) => p === permissionVal)
      console.log(index)

      index > -1 && per.splice(index, 1)
      return per
    })
  }

  // add actions per permission
  const addActions = (checked: boolean, value: string) => {
    setActionPer((lstAct) => {
      const allSelectedAction = [...lstAct]

      const index = allSelectedAction.findIndex((ac) => ac === value)

      // if current value is not in action array then we add it otherwise not
      checked &&
        !allSelectedAction.includes(value) &&
        allSelectedAction.push(value)

      // if checkbox is unchecked and value present in array then we remove it
      !checked && index > -1 && allSelectedAction.splice(index, 1)

      return allSelectedAction
    })
  }

  // remove permission
  const removePermission = (name: string, id: string) => {
    setUserPermission((lstPer) => {
      const allPer = [...lstPer]

      const index = allPer.findIndex((per) => per.id === id)
      allPer.splice(index, 1)

      return allPer
    })

    setPermission((lstPer) => {
      const allPer = [...lstPer]

      allPer.push(name as PERMISSIONTYPE)

      return allPer
    })
  }

  const curRole = roleData.roles.find((role) => role._id === id)

  if (!isPrefilled.current && mode === 'edit' && id && curRole) {
    setValue('roleName', curRole.name)
    setUserPermission(
      curRole.permissions.map((per) => ({ ...per, id: per._id }))
    )
    setPermission((per) => {
      const allPers = [...per]

      curRole.permissions.forEach((el) => {
        const index = allPers.findIndex((alP) => el.name === alP)

        allPers.splice(index, 1)
      })

      return allPers
    })
    isPrefilled.current = true
  }

  Log.log(userPermission)

  return (
    <FormWrapper closeModal={closeModal} title={`${mode} Role`}>
      <form
        noValidate
        onSubmit={handleSubmit(roleSubmissionHandler)}
        className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='name' className='font-medium self-start'>
            Role Name
          </label>
          <input
            type='text'
            id='name'
            {...register('roleName', {
              required: 'role name is required',
              minLength: {
                value: 4,
                message: 'Role name must contain more than 4 letters',
              },
            })}
            className='w-full py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'
            placeholder='admin, user, etc'
          />
          {errors.roleName && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.roleName.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-end'>
            <label htmlFor='permission' className='font-medium'>
              Permissions
            </label>
            <button
              type='button'
              disabled={!watch('permission') || actionPer.length === 0}
              onClick={addUserPermissionHandler}
              className='flex items-center gap-2 max-sm:self-stretch self-end py-1 outline-none rounded bg-lightPr text-darkPr px-3 font-semibold focus:outline-lightPr focus:outline-offset-4 focus:outline-2 disabled:bg-darkTxtFade disabled:bg-opacity-50 disabled:cursor-not-allowed'>
              Add
              <FiPlus />
            </button>
          </div>

          <div className='flex gap-2 items-center'>
            <Select
              value={watch('permission')}
              onValueChange={(perVal) => setValue('permission', perVal)}>
              <SelectTrigger className='w-full capitalize py-2 px-3 bg-transparent outline-none  transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'>
                <SelectValue
                  placeholder='Select Permission'
                  className='capitalize'
                />
              </SelectTrigger>
              <SelectContent className='z-[10001] bg-darkSec shadow-lg text-lightPr border-none'>
                <SelectGroup className='capitalize'>
                  <SelectLabel>Permission</SelectLabel>
                  {permission.map((per) => (
                    <SelectItem value={per} key={per}>
                      {per}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {watch('permission') && (
          <div className='flex items-center gap-2 flex-wrap'>
            <label htmlFor='actions' className='font-medium mr-2'>
              Actions Access:
            </label>
            {actions.map((act) => (
              <div className='' key={act.value} role='button'>
                <input
                  type='checkbox'
                  name={act.value}
                  id={act.value}
                  value={act.value}
                  className='action-checkbox'
                  hidden
                  onChange={(e) => addActions(e.target.checked, act.value)}
                />
                <label
                  htmlFor={act.value}
                  className='cursor-pointer capitalize font-medium flex items-center gap-1 rounded bg-darkTxtFade text-lightPr px-4  py-1 text-sm bg-opacity-10 transition-all hover:bg-opacity-40'>
                  {act.icon}
                  {act.value}
                </label>
              </div>
            ))}
          </div>
        )}

        {userPermission.length > 0 && (
          <div className=''>
            <h4 className='font-medium text-base mb-1'>Permission Assinged:</h4>

            <div className='flex items-center gap-2 flex-wrap w-full'>
              {userPermission.map((per) => (
                <div
                  key={per.id}
                  className='text-sm flex items-start gap-5 py-1 font-medium rounded-md bg-darkTxtFade bg-opacity-20 px-2'>
                  <p className='flex flex-col gap-1'>
                    <span className='mr-3 capitalize'> {per.name}</span>
                    <div className='flex items-center gap-1 text-[12px] text-darkTxtFade'>
                      {per.actions.map(
                        (ac, i) =>
                          `${ac} ${i !== per.actions.length - 1 ? '| ' : ''}`
                      )}
                    </div>
                  </p>

                  <button
                    type='button'
                    onClick={() => removePermission(per.name, per.id)}
                    className='outline-none border flex items-center mt-1 w-5 aspect-square justify-center text-lightPr rounded-full transition-all hover:bg-lightPr hover:text-darkPr'>
                    <BiX className='text-lg' />
                  </button>
                </div>
              ))}
            </div>
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

export default RoleForm
