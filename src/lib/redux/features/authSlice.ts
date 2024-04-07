import { IUserSession } from '@/lib/types/global.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: IUserSession | null
  isLoggedIn: boolean
}

const init: AuthState = {
  isLoggedIn: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: init,
  reducers: {
    logIn(state, action: PayloadAction<IUserSession>) {
      state.isLoggedIn = true
      state.user = action.payload
    },
    logOut(state) {
      state.isLoggedIn = false
      state.user = null
    },
  },
})

export const authReducers = authSlice.reducer
export const authActions = authSlice.actions
