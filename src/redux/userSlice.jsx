import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    tours: [], 
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    setTours: (state, action) => {
      state.tours = action.payload;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setUser, setTours, startLoading, stopLoading } = userSlice.actions;
export default userSlice.reducer;
