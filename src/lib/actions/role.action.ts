'use server'
import { connectToDB } from '../server/db'
import { Log } from '../logs'
import { ActionResponse, Response, ServerError } from '../response'
import RoleModel from '../schemas/role.schema'
import { RolePayload } from '../types/payload.types'
import { PERMISSIONTYPE } from '../utils/global.utils'
import { RemoveActionType } from '../types/global.types'
import UserModel from '../schemas/user.schema'
import { revalidatePath } from 'next/cache'
import { checkActionPermission } from '../server/auth'

const CUR_PERMISSION: PERMISSIONTYPE = 'roles'

export const newRoleAction: (
  role: RolePayload
) => Promise<ActionResponse<{ role: string }>> = async (role: RolePayload) => {
  try {
    const db = await connectToDB()

    const hasPermission = await checkActionPermission('add', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to add', 401)

    const newRole = await RoleModel.create({
      name: role.name,
      permissions: role.permission,
    })

    Log.log(newRole)

    return Response.success({
      message: `New Role: ${role.name} Created Successfully`,
      data: { role: JSON.stringify(newRole) },
      statusCode: 201,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

export const updateRoleAction: (
  id: string,
  role: RolePayload
) => Promise<ActionResponse<{ role: string }>> = async (id, role) => {
  try {
    const db = await connectToDB()

    const hasPermission = await checkActionPermission('update', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to update', 401)

    const updatedRole = await RoleModel.findByIdAndUpdate(
      id,
      {
        name: role.name,
        permissions: role.permission,
      },
      {
        new: true,
      }
    )

    Log.log(updatedRole)

    if (!updatedRole) throw new ServerError('No Data found', 404)

    return Response.success({
      message: `Role: ${role.name} Updated Successfully`,
      data: { role: JSON.stringify(updatedRole) },
      statusCode: 200,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}

export const removeRoleAction: RemoveActionType = async (id) => {
  try {
    const db = await connectToDB()

    const hasPermission = await checkActionPermission('remove', CUR_PERMISSION)

    if (!hasPermission)
      throw new ServerError('You no longer have permission to remove', 401)

    const role = await RoleModel.findByIdAndDelete(id)

    // removing all users holding this role
    await UserModel.deleteMany({ roleId: id })

    revalidatePath('/users')

    return Response.success({
      message: `${role?.name} Role deleted Successfully`,
      data: {
        id: role?._id.toString(),
      },
      statusCode: 200,
    })
  } catch (err) {
    const error = Response.error(err)
    return error
  }
}
