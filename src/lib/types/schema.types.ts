/*export interface IUserSchema {
  picture: string
  username: string
  fullname: string
  emailId: string
  password: string
  status: 'verified' | 'registered'
  verification:
    | {
        count: number
        retryTime: Date
      }
    | undefined
}

export interface IUserInstanceMethods {
  generateUserOTP: (expireTimeMinutes: number) => {
    key: string
    expireTime: Date
    otp: number
  }
}

export type IUserModel = Model<IUserSchema, {}, IUserInstanceMethods>
*/

import { Model } from 'mongoose'

export interface timeStamps {
  createdAt: string
  updatedAt: string
  createdBy: { id: string; name: string }
  updatedBy: { id: string; name: string }
}

export interface IProductSchema extends timeStamps {
  name: string
  price: number
  sizes: {
    price: number
    size: string
    _id?: string
  }[]
  rating: number
  reviews: {
    userId: string
    review: string
    rating: number
    username: string
    date?: Date
    _id?: string
  }[]
  description: string
  categoryId: string
  images: string[]
  ingredients: { name: string; description: string; _id?: string }[]
  units: number
}

export type IProductModel = Model<IProductSchema, {}, {}>

export interface ICustomerSchema extends timeStamps {
  username: string
  email: string
  firstName: string
  lastName: string
  mobileNo: number
}

export type ICustomerModel = Model<ICustomerSchema, {}, {}>

export interface IUserSchema extends timeStamps {
  username: string
  fullName: string
  roleId: string
  password: string
  displayPic?: string
}

export type IUserModel = Model<IUserSchema, {}, {}>

export const ORDER_STATUS = [
  'inCart',
  'placed',
  'inTransit',
  'shipped',
  'delivered',
] as const
export type TOrderStatus = (typeof ORDER_STATUS)[number]

export interface IOrderSchema extends timeStamps {
  products: ProductOrderInfo[]
  userId: string
  totalAmount: number
  status: TOrderStatus
}

export interface ProductOrderInfo {
  id: string
  size: string
  quantity: number
  price: number
  image: string
  name: string
}

export type IOrderModel = Model<IOrderSchema, {}, {}>

export interface IRoleSchema extends timeStamps {
  name: string
  permissions: { name: string; actions: string[]; _id: string }[]
}

export type IRoleModel = Model<IRoleSchema, {}, {}>

export interface ICategorySchema extends timeStamps {
  name: string
}

export type ICategoryModel = Model<ICategorySchema, {}, {}>
