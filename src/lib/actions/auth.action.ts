'use server'
import { cookies } from 'next/headers'
import { connectToDB } from '../server/db'
import { Response, ServerError } from '../response'
import UserModel from '../schemas/user.schema'
import { LoginPayload } from '../types/payload.types'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

type UserId = { id: string }

export const login = async (userData: LoginPayload, redirectUrl: string) => {
  let loggedIn = false
  let error
  try {
    await connectToDB()

    const user = await UserModel.findOne({ username: userData.username })

    // checking user exists
    if (!user) throw new ServerError('Invalid Username or password', 404)

    const passIsCorrect = await bcrypt.compare(userData.password, user.password)

    // checking password
    if (!passIsCorrect)
      throw new ServerError('Invalid Username or password', 404)

    const userInfo: UserId = {
      id: user._id.toString(),
    }

    const authToken = jwt.sign(userInfo, process.env.JWT_SECRET!, {
      expiresIn: '36h',
    })
    const expires = Date.now() + 30 * 60 * 60 * 1000

    cookies().set('auth', authToken, {
      expires: new Date(expires),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: true,
    })

    loggedIn = true
  } catch (err) {
    error = Response.error(err)
    loggedIn = false
  }
  return loggedIn ? redirect(redirectUrl) : error
}

export const logOut = async () => {
  cookies().set('auth', '', { expires: new Date(0) })
  redirect('/login')
}
