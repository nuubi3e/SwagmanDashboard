import { CTUser } from '@/lib/types/client.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  users: CTUser[]
}
const init: UserState = {
  users: [],
}

const userSlice = createSlice({
  name: 'users',
  initialState: init,
  reducers: {
    storeUsers(state, action: PayloadAction<CTUser[]>) {
      state.users = action.payload
    },
    removeUser(state, action: PayloadAction<string>) {
      const index = state.users.findIndex((user) => user._id === action.payload)

      state.users.splice(index, 1)
    },
    addUser(state, action: PayloadAction<CTUser>) {
      state.users.unshift(action.payload)
    },
    updateUser(state, action: PayloadAction<CTUser>) {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      )

      state.users.splice(index, 1, action.payload)
    },
  },
})

export const userReducers = userSlice.reducer
export const userActions = userSlice.actions
