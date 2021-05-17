import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../store'
import { User } from '../../types'

export interface AuthState {
  user: User | undefined
  accessToken: string | undefined
}

const initialState: AuthState = {
  user: undefined,
  accessToken: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    },
  },
})

export const { setAuth } = authSlice.actions

// Export function to select auth from the store
export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer
