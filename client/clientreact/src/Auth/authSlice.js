import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
  username: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      console.log(action.payload);
      state.role = action.payload.role;
      // state.username.action.payload.username;
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
