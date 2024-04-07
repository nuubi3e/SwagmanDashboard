import { CTRole } from '@/lib/types/client.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RoleState {
  roles: CTRole[]
}
const init: RoleState = {
  roles: [],
}

const roleSlice = createSlice({
  name: 'roles',
  initialState: init,
  reducers: {
    storeRoles(state, action: PayloadAction<CTRole[]>) {
      state.roles = action.payload
    },
    removeRole(state, action: PayloadAction<string>) {
      const index = state.roles.findIndex((rl) => rl._id === action.payload)

      state.roles.splice(index, 1)
    },
    addRole(state, action: PayloadAction<CTRole>) {
      state.roles.unshift(action.payload)
    },
    updateRole(state, action: PayloadAction<{ role: CTRole; id: string }>) {
      const index = state.roles.findIndex(
        (role) => role._id === action.payload.id
      )

      state.roles.splice(index, 1, action.payload.role)
    },
  },
})

export const roleReducers = roleSlice.reducer
export const roleAcions = roleSlice.actions
