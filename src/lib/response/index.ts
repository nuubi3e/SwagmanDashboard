import { Log } from '../logs'

export type ActionResponse<Response> = {
  status: 'success' | 'fail' | 'error'
  statusCode: number
  message: string
  ok: boolean
  data?: Response
}

export class ServerError extends Error {
  statusCode: number
  status: 'fail' | 'error'

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`[0] === '4' ? 'fail' : 'error'
  }
}

export class Response {
  constructor() {}

  static success<T>(obj: { message: string; data: T; statusCode: number }) {
    const res: ActionResponse<any> = {
      ...obj,
      status: 'success',
      ok: true,
    }

    return res
  }

  static error(err: any) {
    Log.error(err.name)
    Log.error('BEF ERROR: ', err)
    // Creating a user friendly error object
    const error: ActionResponse<undefined> = {
      status: err?.status || 'error',
      statusCode: err?.statusCode || 500,
      message: err?.message || 'Unhandled Server Error',
      ok: false,
    }

    // MONGOOSE ERROR

    // handling Validation Error
    if (err?.name === 'ValidationError') {
      error.statusCode = 403 // Forbidden or not allowed error code
      error.status = 'fail'
      error.message = err.message.split(': ').at(-1) as string
    }

    // handling Token Error
    if (err?.name === 'JsonWebTokenError') {
      error.statusCode = 401 // Un Authorized
      error.status = 'fail'
      error.message = err.message
    }

    // handling Wrong ID Error
    if (err?.name === 'CastError') {
      error.statusCode = 404 // NOT FOUND ERROR CODE
      error.status = 'fail'
      error.message = `Invalid ${err.path}: ${err.value}`
    }

    // handling duplicate value error
    if (err?.code === 11000) {
      const value = err.keyValue

      const message = `${Object.keys(value)}: ${
        value[Object.keys(value)[0]]
      } already exists`

      error.statusCode = 400 //Bad request error code for duplicate value
      error.status = 'fail'
      error.message = message
    }

    Log.error('SERVER ERROR: ', error)

    return error
  }
}
