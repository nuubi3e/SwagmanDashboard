const log = (...args: any) =>
  process.env.NODE_ENV === 'development' && console.log(...args)

const error = (...args: any) =>
  process.env.NODE_ENV === 'development' && console.error(...args)

export const Log = { log, error }
