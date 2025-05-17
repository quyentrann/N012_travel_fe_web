import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getTours, getFavoriteTours, calculateChangeFee, changeTour } from '../apis/tour';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const fetchTours = createAsyncThunk('tours/fetchTours', async (_, { rejectWithValue }) => {
  try {
    const data = await getTours();
    console.log('fetchTours data:', data);
    return data;
  } catch (error) {
    console.error('fetchTours error:', error);
    return rejectWithValue(error.message || 'Không tải được danh sách tour');
  }
});

export const fetchFavoriteTours = createAsyncThunk('tours/fetchFavoriteTours', async (_, { rejectWithValue }) => {
  try {
    const data = await getFavoriteTours();
    console.log('fetchFavoriteTours data:', data);
    return data;
  } catch (error) {
    console.error('fetchFavoriteTours error:', error);
    return rejectWithValue(error.message || 'Không tải được tour yêu thích');
  }
});

export const toggleFavoriteTour = createAsyncThunk(
  'tours/toggleFavoriteTour',
  async ({ tourId, isFavorite }, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) throw new Error('Không có token');
      if (isFavorite) {
        await axios.post(
          `${API_BASE_URL}/tour-favourites`,
          { tourId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(`${API_BASE_URL}/tour-favourites`, {
          data: { tourId },
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const { tours } = getState().tours;
      const tour = tours.find((t) => t.tourId === tourId);
      return { tourId, isFavorite, tour };
    } catch (error) {
      console.error('toggleFavoriteTour error:', error);
      return rejectWithValue({
        message: error.message || 'Không thể cập nhật tour yêu thích',
        status: error.response?.status,
      });
    }
  }
);

export const calculateChangeFeeThunk = createAsyncThunk(
  'tours/calculateChangeFee',
  async ({ bookingId, changeRequest }, { rejectWithValue }) => {
    try {
      const response = await calculateChangeFee(bookingId, changeRequest);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changeTourThunk = createAsyncThunk(
  'tours/changeTour',
  async ({ bookingId, changeRequest }, { rejectWithValue }) => {
    try {
      const response = await changeTour(bookingId, changeRequest);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const tourSlice = createSlice({
  name: 'tours',
  initialState: {
    tours: [],
    filteredTours: [],
    favoriteTours: [],
    changeFee: null,
    changeTourResult: null,
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
    clearChangeFee: (state) => {
      state.changeFee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        const uniqueTours = Array.from(
          new Map((action.payload || []).map((tour) => [tour.tourId, tour])).values()
        );
        state.tours = uniqueTours;
        state.filteredTours = uniqueTours;
        state.loading = false;
        console.log('fetchTours fulfilled, tours:', state.tours);
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không tải được danh sách tour';
        state.tours = [];
        state.filteredTours = [];
        console.log('fetchTours rejected, error:', state.error);
      })
      .addCase(fetchFavoriteTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteTours.fulfilled, (state, action) => {
        const uniqueTours = Array.from(
          new Map((action.payload || []).map((tour) => [tour.tourId, tour])).values()
        );
        state.favoriteTours = uniqueTours;
        state.loading = false;
        console.log('fetchFavoriteTours fulfilled, favoriteTours:', state.favoriteTours);
      })
      .addCase(fetchFavoriteTours.rejected, (state, action) => {
        state.favoriteTours = [];
        state.loading = false;
        state.error = action.payload || 'Không tải được tour yêu thích';
        console.log('fetchFavoriteTours rejected, error:', state.error);
      })
      .addCase(toggleFavoriteTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteTour.fulfilled, (state, action) => {
        const { tourId, isFavorite, tour } = action.payload;
        if (isFavorite) {
          if (tour && !state.favoriteTours.some((fav) => fav.tourId === tourId)) {
            state.favoriteTours.push(tour);
          }
        } else {
          state.favoriteTours = state.favoriteTours.filter((fav) => fav.tourId !== tourId);
        }
        state.loading = false;
        console.log('toggleFavoriteTour fulfilled, favoriteTours:', state.favoriteTours);
      })
      .addCase(toggleFavoriteTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Không thể cập nhật tour yêu thích';
        console.log('toggleFavoriteTour rejected, error:', state.error);
      })
      .addCase(calculateChangeFeeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateChangeFeeThunk.fulfilled, (state, action) => {
        state.changeFee = action.payload;
        state.loading = false;
        console.log('calculateChangeFee fulfilled, changeFee:', state.changeFee);
      })
      .addCase(calculateChangeFeeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể tính phí đổi tour';
        console.log('calculateChangeFee rejected, error:', state.error);
      })
      .addCase(changeTourThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeTourThunk.fulfilled, (state, action) => {
        state.changeTourResult = action.payload;
        state.loading = false;
        console.log('changeTour fulfilled, changeTourResult:', state.changeTourResult);
      })
      .addCase(changeTourThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể đổi tour';
        console.log('changeTour rejected, error:', state.error);
      });
  },
});

export const { setFilteredTours, resetFavoriteTours, clearChangeFee } = tourSlice.actions;
export default tourSlice.reducer;