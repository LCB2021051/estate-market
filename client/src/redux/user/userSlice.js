import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFaliure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
    deleteUserFaliure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutStart: (state) => {
      state.loading = true;
    },
    signOutSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    signOutFaliure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFaliure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFaliure,
  signOutStart,
  signOutSuccess,
  signOutFaliure,
} = userSlice.actions;

export default userSlice.reducer;
