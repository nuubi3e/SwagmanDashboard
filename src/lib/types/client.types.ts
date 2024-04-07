import { FC } from 'react'
import {
  ICategorySchema,
  IProductSchema,
  IRoleSchema,
  timeStamps,
} from './schema.types'

export type CTRole = IRoleSchema & {
  _id: string
}

export type CTUser = timeStamps & {
  _id: string
  username: string
  fullName: string
  roleId: string
  displayPic?: string
  role?: string
}

export type CTCategory = ICategorySchema & {
  _id: string
}

export type CTProduct = IProductSchema & {
  _id: string
}

export type FORMTYPES = 'user' | 'role' | 'category' | 'product'

export type CTEditDeleteBtnCP = FC<{
  id: string
  title: FORMTYPES
  curUserId?: string
}>

export type CTAddEditForms = FC<{
  closeModal: () => void
  mode: 'add' | 'edit'
  id?: string
}>
