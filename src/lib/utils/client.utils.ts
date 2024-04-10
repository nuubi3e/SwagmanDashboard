import { ACTIONTYPE } from './global.utils'
import { CTEditDeleteBtnCP } from '../types/client.types'
import { DeleteActionButton, UpdateActionButton } from '@/components/Buttons'
import { v4 } from 'uuid'
import toast from 'react-hot-toast'

export const generateId = () => v4().slice(0, 16)

export const getActionCP = (actions: ACTIONTYPE[]) => {
  type ActionBtnJSX = Record<ACTIONTYPE, null | CTEditDeleteBtnCP>

  const actionJSXObj: ActionBtnJSX = {
    add: null,
    remove: DeleteActionButton,
    update: UpdateActionButton,
    view: null,
  }

  return actions.map((act) => actionJSXObj[act])
}
