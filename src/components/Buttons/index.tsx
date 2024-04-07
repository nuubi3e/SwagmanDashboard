'use client'
import { FaPlus } from 'react-icons/fa6'
import { useState } from 'react'
import RoleForm from '@/components/forms/RoleForm'
import { AnimatePresence } from 'framer-motion'
import UserForm from '../forms/UserForm'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import {
  CTAddEditForms,
  CTEditDeleteBtnCP,
  FORMTYPES,
} from '@/lib/types/client.types'
import { LuTrash } from 'react-icons/lu'
import toast from 'react-hot-toast'
import ConfirmModal from '../ConfirmModal'
import { RemoveActionType } from '@/lib/types/global.types'
import { removeRoleAction } from '@/lib/actions/role.action'
import { useAppDispatch } from '@/lib/redux/hook'
import { roleAcions } from '@/lib/redux/features/roleSlice'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { authActions } from '@/lib/redux/features/authSlice'
import { logOut } from '@/lib/actions/auth.action'
import { RiLogoutCircleLine, RiMenu2Fill } from 'react-icons/ri'
import { deleteUserAction } from '@/lib/actions/user.action'
import { userActions } from '@/lib/redux/features/userSlice'
import { removeCategoryActions } from '@/lib/actions/category.action'
import { categoryActions } from '@/lib/redux/features/categorySlice'
import CategoryForm from '../forms/CategoryForm'
import { uiActions } from '@/lib/redux/features/uiSlice'
import ProductForm from '../forms/ProductForm'
import { removeProductAction } from '@/lib/actions/product.action'
import { productActions } from '@/lib/redux/features/productSlice'

interface NewActionButtonProps {
  title: FORMTYPES
}

type AddEditForm = Record<FORMTYPES, CTAddEditForms>

const AddEditForms: AddEditForm = {
  category: CategoryForm,
  product: ProductForm,
  role: RoleForm,
  user: UserForm,
}

type DeleteBtnType = Record<
  FORMTYPES,
  {
    serverFn: RemoveActionType
    clientFn: ActionCreatorWithPayload<string>
    note?: string
  }
>
const DeletBtnActions: DeleteBtnType = {
  role: {
    serverFn: removeRoleAction,
    clientFn: roleAcions.removeRole,
    note: 'All user holding this role will also get removed.',
  },
  user: {
    serverFn: deleteUserAction,
    clientFn: userActions.removeUser,
  },
  category: {
    serverFn: removeCategoryActions,
    clientFn: categoryActions.deleteCategory,
    note: 'All Product in this category will also get removed.',
  },
  product: {
    serverFn: removeProductAction,
    clientFn: productActions.deleteProduct,
  },
}

export const NewActionButton = ({ title }: NewActionButtonProps) => {
  const [openModal, setOpenModal] = useState(false)

  const FormCP = AddEditForms[title]

  return (
    <>
      <button
        type='button'
        onClick={() => setOpenModal((lst) => !lst)}
        className='flex items-center gap-2 py-3 px-6 capitalize font-semibold rounded-full bg-darkTxtFade bg-opacity-30 text-lightPr transition-all outline-none hover:bg-lightPr hover:text-darkPr focus:outline-lightPr focus:outline-offset-4 focus:outline-2'>
        <FaPlus /> New {title}
      </button>
      <AnimatePresence mode='wait'>
        {openModal && (
          <FormCP closeModal={() => setOpenModal(false)} mode='add' />
        )}
      </AnimatePresence>
    </>
  )
}

export const UpdateActionButton: CTEditDeleteBtnCP = ({ id, title }) => {
  const [openModal, setOpenModal] = useState(false)

  const FormCP = AddEditForms[title]

  return (
    <>
      <button
        type='button'
        onClick={() => setOpenModal((lst) => !lst)}
        className='outline-none'>
        <MdOutlineModeEditOutline className='text-xl' />
      </button>
      <AnimatePresence mode='wait'>
        {openModal && FormCP && (
          <FormCP mode='edit' closeModal={() => setOpenModal(false)} id={id} />
        )}
      </AnimatePresence>
    </>
  )
}

export const DeleteActionButton: CTEditDeleteBtnCP = ({
  id,
  title,
  curUserId,
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const dispatch = useAppDispatch()

  const curButtonAction = DeletBtnActions[title]

  const removeHandler = async () => {
    setConfirming(true)
    try {
      const res = await curButtonAction.serverFn(id!)

      if (!res.ok) throw new Error(res.message)

      dispatch(curButtonAction.clientFn(res.data?.id || ''))
      setOpenModal(false)
      toast.success(res.message)
    } catch (err) {
    } finally {
      setConfirming(false)
    }
  }

  if (curUserId === id) return

  return (
    <>
      <button
        type='button'
        onClick={() => setOpenModal((lst) => !lst)}
        className='outline-none'>
        <LuTrash className='text-xl' />
      </button>
      <AnimatePresence mode='wait'>
        {openModal && (
          <ConfirmModal
            onClose={() => setOpenModal(false)}
            onConfirm={() => removeHandler()}
            loading={confirming}
            note={curButtonAction?.note}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export const LogOutBtn = () => {
  const dispatch = useAppDispatch()

  const logoutHandler = async () => {
    dispatch(authActions.logOut())
    await logOut()
  }

  return (
    <button
      type='button'
      onClick={logoutHandler}
      className='flex items-center gap-3 justify-center font-medium py-3 rounded-tr-full text-darkTxtFade rounded-br-full mr-7 transition-all hover:bg-lightPr hover:text-darkPr'>
      <RiLogoutCircleLine /> Logout
    </button>
  )
}

export const LeftNavToggleBtn = () => {
  const dispatch = useAppDispatch()
  return (
    <button
      type='button'
      className='lg:hidden outline-none'
      onClick={() => dispatch(uiActions.openNav())}>
      <RiMenu2Fill className='text-lightPr text-3xl' />
    </button>
  )
}
