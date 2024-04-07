import { CTCategory } from '@/lib/types/client.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CategoryState {
  categories: CTCategory[]
}

const init: CategoryState = {
  categories: [],
}

const categorySlice = createSlice({
  name: 'category',
  initialState: init,
  reducers: {
    storeCategories(state, action: PayloadAction<CTCategory[]>) {
      state.categories = action.payload
    },
    deleteCategory(state, action: PayloadAction<string>) {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload
      )

      state.categories.splice(index, 1)
    },
    addCategory(state, action: PayloadAction<CTCategory>) {
      state.categories.unshift(action.payload)
    },
    updateCategory(state, action: PayloadAction<CTCategory>) {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload._id
      )

      state.categories.splice(index, 1, action.payload)
    },
  },
})

export const categoryReducers = categorySlice.reducer
export const categoryActions = categorySlice.actions
