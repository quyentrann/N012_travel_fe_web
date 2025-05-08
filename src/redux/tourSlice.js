import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getTours } from '../apis/tour';

export const fetchTours = createAsyncThunk('tours/fetchTours', async (_, { rejectWithValue }) => {
  try {
    const data = await getTours();
    console.log('fetchTours data:', data); // Debug
    return data;
  } catch (error) {
    console.error('fetchTours error:', error);
    return rejectWithValue(error.message || 'Failed to fetch tours');
  }
});

export const fetchFavoriteTours = createAsyncThunk('tours/fetchFavoriteTours', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) return [];
    const response = await axios.get('http://localhost:8080/api/tour-favourites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('fetchFavoriteTours data:', response.data); // Debug
    return response.data;
  } catch (error) {
    console.error('fetchFavoriteTours error:', error);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorite tours');
  }
});

const tourSlice = createSlice({
  name: 'tours',
  initialState: {
    tours: [],
    filteredTours: [],
    favoriteTours: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFilteredTours: (state, action) => {
      state.filteredTours = action.payload;
    },
    resetFavoriteTours: (state) => {
      state.favoriteTours = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.tours = action.payload || [];
        state.filteredTours = action.payload || [];
        state.loading = false;
        console.log('fetchTours fulfilled, tours:', state.tours); // Debug
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tours';
        state.tours = [];
        state.filteredTours = [];
        console.log('fetchTours rejected, error:', state.error); // Debug
      })
      .addCase(fetchFavoriteTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteTours.fulfilled, (state, action) => {
        state.favoriteTours = action.payload || [];
        state.loading = false;
        console.log('fetchFavoriteTours fulfilled, favoriteTours:', state.favoriteTours); // Debug
      })
      .addCase(fetchFavoriteTours.rejected, (state, action) => {
        state.favoriteTours = [];
        state.loading = false;
        state.error = action.payload || 'Failed to fetch favorite tours';
        console.log('fetchFavoriteTours rejected, error:', state.error); // Debug
      });
  },
});

export const { setFilteredTours, resetFavoriteTours } = tourSlice.actions;
export default tourSlice.reducer;