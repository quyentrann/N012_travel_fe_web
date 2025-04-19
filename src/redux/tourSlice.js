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
    error: null,
  },
  reducers: {
    setFilteredTours: (state, action) => {
      state.filteredTours = action.payload;
    },
    filterByCategory: (state, action) => {
      const category = action.payload;
      state.filteredTours = state.tours.filter((tour) =>
        tour.category?.toLowerCase().includes(category.toLowerCase())
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.tours = action.payload;
        state.filteredTours = action.payload;
        state.loading = false;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilteredTours, filterByCategory } = tourSlice.actions;
export default tourSlice.reducer;