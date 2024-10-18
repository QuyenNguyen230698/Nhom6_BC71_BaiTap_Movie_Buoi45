import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoading: false,
}

const spinnerSlice = createSlice({
  name: "spinnerSlice",
  initialState,
  reducers: {
    turnOnloading: (state,action) => {
        state.isLoading = true;
    },
    turnOffLoading: (state,action) => {
        state.isLoading = false;
    }
  }
});

export const {turnOnloading,turnOffLoading} = spinnerSlice.actions

export default spinnerSlice.reducer