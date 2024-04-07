export const PERMISSIONS = [
  'products',
  'categories',
  'orders',
  'roles',
  'users',
] as const
export const ACTIONS = ['add', 'update', 'remove', 'view'] as const

export type PERMISSIONTYPE = (typeof PERMISSIONS)[number]

export type ACTIONTYPE = (typeof ACTIONS)[number]

export const dateConverter = (date: string) =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
    .format(new Date(date))
    .replaceAll('-', ' ')
