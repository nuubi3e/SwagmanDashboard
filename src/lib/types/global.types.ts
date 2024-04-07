import { ActionResponse } from '../response'

export interface IUserSession {
  name: string
  username: string
  picture: string
  id: string
  roleId: string
}

export type RemoveActionType = (
  id: string
) => Promise<ActionResponse<{ id: string }>>

export type SearchParams = 'page' | 'item'
