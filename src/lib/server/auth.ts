import { cookies } from 'next/headers'
import { connectToDB } from './db'
import jwt from 'jsonwebtoken'
import UserModel from '../schemas/user.schema'
import { IUserSession } from '../types/global.types'
import { Log } from '../logs'
import { ACTIONTYPE, PERMISSIONTYPE } from '../utils/global.utils'
import RoleModel from '../schemas/role.schema'

type UserId = { id: string }

export const getSession = async () => {
  try {
    await connectToDB()
    const authCookie = cookies().get('auth')?.value

    if (!authCookie) throw new Error('Session Expired')

    const data = jwt.verify(authCookie, process.env.JWT_SECRET!) as UserId

    const user = await UserModel.findOne({ _id: data.id }).select(
      '-__v -password'
    )

    if (!user) throw new Error('user no longer exists')

    const userData: IUserSession = {
      id: user._id.toString(),
      name: user.fullName,
      username: user.username,
      picture: user.displayPic || '',
      roleId: user.roleId,
    }

    return userData
  } catch (err) {
    Log.error('SESSION ERROR: ', err)
    return null
  }
}

export const checkViewPermission = async (permissionName: PERMISSIONTYPE) => {
  try {
    const user = await getSession()

    if (!user) throw new Error('')

    const userInDB = await UserModel.findOne({ _id: user.id })

    if (!userInDB) throw new Error('')

    const role = await RoleModel.findOne({
      _id: userInDB.roleId,
    })

    const hasPermission = role?.permissions.some(
      (per) => per.name === permissionName
    )

    if (!hasPermission) throw new Error('')

    return true
  } catch (err) {
    return false
  }
}

export const checkActionPermission = async (
  actionName: ACTIONTYPE,
  permissionName: PERMISSIONTYPE
) => {
  try {
    const user = await getSession()

    if (!user) throw new Error('')

    const userInDB = await UserModel.findOne({ _id: user.id })

    if (!userInDB) throw new Error('')

    const role = await RoleModel.findOne({
      _id: userInDB.roleId,
    })

    const permission = role?.permissions.find(
      (per) => per.name === permissionName
    )

    if (!permission) throw new Error('')

    const hasAction = permission.actions.some((act) => act === actionName)

    if (!hasAction) throw new Error('')

    return true
  } catch (err) {
    return false
  }
}

export const getActions: (
  per: PERMISSIONTYPE
) => Promise<ACTIONTYPE[]> = async (permissionName: PERMISSIONTYPE) => {
  try {
    const user = await getSession()

    const userInDB = await UserModel.findOne({ _id: user?.id })

    if (!userInDB) throw new Error('')

    const role = await RoleModel.findOne({ _id: userInDB.roleId })
    const actions =
      (role?.permissions.find((per) => per.name === permissionName)
        ?.actions as ACTIONTYPE[]) || []

    return actions
  } catch (err) {
    return []
  }
}
