import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  showLeftNav: boolean
}

const init: UIState = {
  showLeftNav: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: init,
  reducers: {
    toggleNav(state) {
      state.showLeftNav = !state.showLeftNav
    },
    closeNav(state) {
      state.showLeftNav = false
    },
    openNav(state) {
      state.showLeftNav = true
    },
  },
})

export const uiReducers = uiSlice.reducer
export const uiActions = uiSlice.actions