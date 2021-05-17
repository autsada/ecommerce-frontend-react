import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../store'

type ModalType = 'close' | 'signup' | 'signin' | 'request_reset_password'

export interface ModalState {
  modal: ModalType
}

const initialState: ModalState = {
  modal: 'close',
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<ModalType>) => {
      state.modal = action.payload
    },
  },
})

export const { setModal } = modalSlice.actions

// Export function to select modal from the store
export const selectModal = (state: RootState) => state.modal.modal

export default modalSlice.reducer
