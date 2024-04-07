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
  rating: number
  reviews: {
    userId: string
    review: string
    rating: string
    username: string
  }[]
  description: string
  categoryId: string
  images: string[]
  ingredients: { name: string; description: string }[]
  units: number
}

export type IProductModel = Model<IProductSchema, {}, {}>

export interface IUserSchema extends timeStamps {
  username: string
  fullName: string
  roleId: string
  password: string
  displayPic?: string
}

export type IUserModel = Model<IUserSchema, {}, {}>

export interface IRoleSchema extends timeStamps {
  name: string
  permissions: { name: string; actions: string[]; _id: string }[]
}

export type IRoleModel = Model<IRoleSchema, {}, {}>

export interface ICategorySchema extends timeStamps {
  name: string
}

export type ICategoryModel = Model<ICategorySchema, {}, {}>
