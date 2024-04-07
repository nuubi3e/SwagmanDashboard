import { CTProduct } from '@/lib/types/client.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProductState {
  products: CTProduct[]
}

const init: ProductState = {
  products: [],
}

const productSlice = createSlice({
  name: 'products',
  initialState: init,
  reducers: {
    storeProducts(state, action: PayloadAction<CTProduct[]>) {
      state.products = action.payload
    },
    deleteProduct(state, action: PayloadAction<string>) {
      const index = state.products.findIndex(
        (prd) => prd._id === action.payload
      )

      state.products.splice(index, 1)
    },
    addProduct(state, action: PayloadAction<CTProduct>) {
      state.products.unshift(action.payload)
    },
    updateProduct(state, action: PayloadAction<CTProduct>) {
      const index = state.products.findIndex(
        (cat) => cat._id === action.payload._id
      )

      state.products.splice(index, 1, action.payload)
    },
  },
})

export const productActions = productSlice.actions
export const productReducers = productSlice.reducer
