// locationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async () => {
  const response = await axios.get('https://provinces.open-api.vn/api/');
  return response.data.map((province) => ({
    value: province.code,
    label: province.name,
  }));
});

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    locations: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      state.locations = action.payload;
      state.loading = false;
    });
  },
});

export default locationSlice.reducer;