// tourSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTours } from '../apis/tour';

export const fetchTours = createAsyncThunk('tours/fetchTours', async () => {
  const data = await getTours();
  return data;
});

const tourSlice = createSlice({
  name: 'tours',
  initialState: {
    tours: [],
    filteredTours: [],
    loading: false,
  },
  reducers: {
    setFilteredTours: (state, action) => {
      state.filteredTours = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTours.fulfilled, (state, action) => {
      state.tours = action.payload;
      state.filteredTours = action.payload;
      state.loading = false;
    });
  },
});

export const { setFilteredTours } = tourSlice.actions;
export default tourSlice.reducer;