// searchHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSearchHistory } from '../apis/tour';

export const fetchSearchHistory = createAsyncThunk('searchHistory/fetchSearchHistory', async () => {
  const data = await getSearchHistory();
  return data;
});

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