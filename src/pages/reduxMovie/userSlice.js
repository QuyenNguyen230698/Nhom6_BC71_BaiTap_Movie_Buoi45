import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    dataLogin: localStorage.getItem("DATA_USER") ? JSON.parse(localStorage.getItem("DATA_USER")) : null,
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserAction: (state,action) => {
        state.dataLogin = action.payload;
    }
  }
});

export const {setUserAction} = userSlice.actions

export default userSlice.reducer
