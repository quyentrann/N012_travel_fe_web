import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    initializeAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.user;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload; // Cập nhật toàn bộ thông tin user
      state.isAuthenticated = true; // Đảm bảo vẫn đăng nhập
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout, initializeAuth, updateUser } = userSlice.actions;
export default userSlice.reducer;