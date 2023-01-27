import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.role = action.payload;
      console.log(state.role);
    },

    clearToken(state, action) {
      state.token = null;
      state.role = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
