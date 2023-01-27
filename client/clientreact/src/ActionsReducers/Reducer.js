import { createSlice } from "@reduxjs/toolkit";
import { fetchMain, fetchMyClasses } from "./API_Actions";

const initialState = {
  myClasses: [],
  mainPageClasses: [],
  loading: false,
  error: "",
};

const handleAsync = (builder, asyncThunk, property) => {
  builder
    .addCase(asyncThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(asyncThunk.fulfilled, (state, action) => {
      state.loading = false;
      state[property] = action.payload;
    })
    .addCase(asyncThunk.rejected, (state, action) => {
      state.loading = false;

      state.error = action.error.message;
    });
};

const cSlice = createSlice({
  name: "fetchedData",
  initialState,

  extraReducers(builder) {
    handleAsync(builder, fetchMain, "mainPageClasses");
    handleAsync(builder, fetchMyClasses, "myClasses");
  },
});
export default cSlice.reducer;
