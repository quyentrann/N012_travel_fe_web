// searchHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSearchHistory } from '../apis/tour';

export const fetchSearchHistory = createAsyncThunk(
  'searchHistory/fetchSearchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getSearchHistory();
      console.log('Raw history data from API:', data);
      const currentDate = new Date();
      const filteredTours = data
        .filter((tour) => 
          tour.status === 'ACTIVE' &&
          tour.availableSlot > 0 &&
          tour.tourDetails?.some((detail) => new Date(detail.startDate) >= currentDate)
        );
      const uniqueTours = Array.from(
        new Map(filteredTours.map((tour) => [tour.tourId, tour])).values()
      );
      console.log('Filtered history tours:', uniqueTours);
      return uniqueTours;
    } catch (error) {
      console.error('Failed to fetch search history:', error.message);
      return rejectWithValue(error.message || 'Failed to fetch search history');
    }
  }
);

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState: {
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default searchHistorySlice.reducer;