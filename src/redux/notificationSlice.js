// notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUnreadCount = createAsyncThunk('notifications/fetchUnreadCount', async () => {
  const response = await axios.get('/api/notifications/unread-count');
  return response.data.count;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    unreadCount: 0,
    loading: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
      state.loading = false;
    });
  },
});

export default notificationSlice.reducer;