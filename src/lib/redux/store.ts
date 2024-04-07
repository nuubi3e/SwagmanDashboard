import { configureStore } from '@reduxjs/toolkit'
import { roleReducers } from './features/roleSlice'
import { userReducers } from './features/userSlice'
import { authReducers } from './features/authSlice'
import { categoryReducers } from './features/categorySlice'
import { uiReducers } from './features/uiSlice'
import { productReducers } from './features/productSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      roles: roleReducers,
      users: userReducers,
      auth: authReducers,
      category: categoryReducers,
      ui: uiReducers,
      product: productReducers,
    },
  })

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
