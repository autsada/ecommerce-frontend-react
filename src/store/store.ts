import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'

import userReducer from './slices/authSlice'
import modalReducer from './slices/modalSlice'

export const store = configureStore({
  reducer: {
    auth: userReducer,
    modal: modalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
