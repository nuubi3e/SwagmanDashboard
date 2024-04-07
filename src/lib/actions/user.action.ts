'use server'
import { Types } from 'mongoose'
import { connectToDB } from '../server/db'
import { ActionResponse, Response, ServerError } from '../response'
import UserModel from '../schemas/user.schema'
import { UserPayload } from '../types/payload.types'
import { IUserSchema } from '../types/schema.types'
import { PERMISSIONTYPE } from '../utils/global.utils'
import bcrypt from 'bcryptjs'
import { CTUser } from '../types/client.types'
import { RemoveActionType } from '../types/global.types'
import { checkActionPermission } from '../server/auth'

export type User = IUserSchema & {
  _id: Types.ObjectId
}

const CUR_PERMISSION: PERMISSIONTYPE = 'users'

export const newUserAction: (
  user: UserPayload
) => Promise<ActionResponse<{ user: CTUser }>> = async (user: UserPayload) => {
  try {
    const db = await connectToDB()

    const hasPermission = await checkActionPermission('add', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to add', 401)

    const salt = await bcrypt.genSalt(13)
    const encPass = await bcrypt.hash(user.password, salt)
    const newUser = await UserModel.create({ ...user, password: encPass })

    const userDt = {
      ...newUser.toObject(),
      _id: newUser._id.toString(),
      __v: undefined,
      createdAt: newUser.createdAt.toString(),
      updatedAt: newUser.updatedAt.toString(),
      password: undefined,
    }

    return Response.success<{ user: CTUser }>({
      message: `New user: ${user.username} Created Successfully`,
      data: { user: userDt },
      statusCode: 201,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

/**
 * const u = await UserModel.aggregate([
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
        },
      },
      {
        $unwind: '$role',
      },
    ]);
 */

export const updateUserAction: (
  id: string,
  user: UserPayload
) => Promise<ActionResponse<{ user: CTUser }>> = async (id, user) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...user },
      { new: true }
    ).select('-__v -password')

    if (!updatedUser) throw new ServerError('No Data found', 404)

    const userDt = {
      ...updatedUser.toObject(),
      _id: updatedUser._id.toString(),
      __v: undefined,
      createdAt: updatedUser.createdAt.toString(),
      updatedAt: updatedUser.updatedAt.toString(),
    }

    const response = Response.success({
      message: `${user.username} Updated Successfully`,
      data: { user: userDt },
      statusCode: 200,
    })

    return response
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

export const deleteUserAction: RemoveActionType = async (id) => {
  try {
    await connectToDB()

    const hasPermission = await checkActionPermission('remove', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to remove', 401)

    const user = await UserModel.findByIdAndDelete(id)

    return Response.success({
      message: `${user?.username} User deleted Successfully`,
      data: {
        id: user?._id.toString(),
      },
      statusCode: 200,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}
