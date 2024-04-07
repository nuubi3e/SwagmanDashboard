import { Types } from 'mongoose'
import {
  ICategorySchema,
  IProductSchema,
  IRoleSchema,
} from '../types/schema.types'
import { ACTIONTYPE } from '../utils/global.utils'
import { ActionResponse, Response, ServerError } from '../response'
import { connectToDB } from './db'
import { checkViewPermission, getActions, getSession } from './auth'
import { CategoryModel } from '../schemas/category.schema'
import ProductModel from '../schemas/product.schema'
import RoleModel from '../schemas/role.schema'
import { CTUser } from '../types/client.types'
import UserModel from '../schemas/user.schema'

export type Category = ICategorySchema & {
  _id: Types.ObjectId
}

interface CategoryResponse {
  length: number
  categories: Category[]
}

export const getCategories: (
  search?: string
) => Promise<ActionResponse<CategoryResponse>> = async (searchStr) => {
  try {
    await connectToDB()

    if (!checkViewPermission('categories'))
      throw new ServerError(
        'You no longer have permission to view this page',
        401
      )

    const categories = await CategoryModel.find(
      searchStr ? { name: { $regex: searchStr, $options: 'i' } } : {}
    )
      .sort({ createdAt: -1 })
      .select('-__v')

    const response = Response.success<CategoryResponse>({
      message: 'Categories Selected Successfully',
      data: {
        length: categories.length,
        categories,
      },
      statusCode: 200,
    })

    return response
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

export const getCategoriesForDropDown: () => Promise<
  ActionResponse<{ categories: string }>
> = async () => {
  try {
    await connectToDB()

    if (!checkViewPermission('categories'))
      throw new ServerError(
        'You no longer have permission to view this page',
        401
      )

    const categories = await CategoryModel.find()
      .sort({ createdAt: -1 })
      .select('-__v')

    const response = Response.success<{ categories: string }>({
      message: 'Categories Selected Successfully',
      data: {
        categories: JSON.stringify(categories),
      },
      statusCode: 200,
    })

    return response
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

// ------- PRODUCTS --------------------

type Product = IProductSchema & {
  _id: Types.ObjectId
}

interface ProductResponse {
  length: number
  products: Product[]
  actions: ACTIONTYPE[]
}

export const getProducts: () => Promise<
  ActionResponse<ProductResponse>
> = async () => {
  try {
    await connectToDB()

    if (!checkViewPermission('products'))
      throw new ServerError(
        'You no longer have permission to view this page',
        401
      )

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .select('-__v')

    const actions = await getActions('products')

    const response = Response.success<ProductResponse>({
      message: 'Products Selected Successfully',
      data: {
        length: products.length,
        products,
        actions,
      },
      statusCode: 200,
    })

    return response
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

// ----------------- ROLES ------------------

type Role = IRoleSchema & {
  _id: Types.ObjectId
}

interface RoleResponse {
  length: number
  roles: Role[]
  actions: ACTIONTYPE[]
}

export const getRoles: () => Promise<
  ActionResponse<RoleResponse>
> = async () => {
  try {
    await connectToDB()

    const hasPer = await checkViewPermission('roles')
    if (!hasPer)
      throw new ServerError('Session Expired OR No longer have Permission', 401)

    const user = await getSession()
    const roles = await RoleModel.find().sort({ createdAt: -1 }).select('-__v')

    const actions =
      roles
        .find((role) => role._id.toString() === user?.roleId)
        ?.permissions.find((per) => per.name === 'roles')?.actions || []

    return Response.success<RoleResponse>({
      message: 'Role Selected Successfully',
      data: {
        length: roles.length,
        roles,
        actions: actions as ACTIONTYPE[],
      },
      statusCode: 200,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

export const getRolesForDropdown: () => Promise<
  ActionResponse<{ roles: string }>
> = async () => {
  try {
    await connectToDB()

    const hasPer = await checkViewPermission('roles')
    if (!hasPer)
      throw new ServerError('Session Expired OR No longer have Permission', 401)

    const user = await getSession()
    const roles = await RoleModel.find().sort({ createdAt: -1 }).select('-__v')

    const actions =
      roles
        .find((role) => role._id.toString() === user?.roleId)
        ?.permissions.find((per) => per.name === 'roles')?.actions || []

    return Response.success<{ roles: string }>({
      message: 'Role Selected Successfully',
      data: {
        roles: JSON.stringify(roles),
      },
      statusCode: 200,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

//  --------------- USERS -------------------

interface UserResponse {
  length: number
  users: CTUser[]
  actions: ACTIONTYPE[]
}

export const getUsers: () => Promise<
  ActionResponse<UserResponse>
> = async () => {
  try {
    await connectToDB()

    const hasPer = await checkViewPermission('users')
    if (!hasPer)
      throw new ServerError('Session Expired OR No longer have Permission', 401)

    const users = await UserModel.aggregate([
      {
        $addFields: {
          roleObjId: { $toObjectId: '$roleId' },
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleObjId',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $project: {
          role: '$role.name',
          fullName: 1,
          username: 1,
          displayPic: 1,
          _id: 1,
          roleId: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $unwind: '$role',
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])

    const actions = await getActions('users')

    return Response.success<UserResponse>({
      message: 'User Selected Successfully',
      data: {
        length: users.length,
        users,
        actions,
      },
      statusCode: 200,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}
