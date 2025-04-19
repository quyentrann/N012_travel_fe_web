import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tourReducer  from './tourSlice';
import locationReducer from './locationSlice';
import notificationReducer from './notificationSlice';
import searchReducer from './searchSlice';
import searchHistoryReducer from './searchHistorySlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    tours: tourReducer,
    locations: locationReducer,
    notifications: notificationReducer,
    search: searchReducer,
    searchHistory: searchHistoryReducer,
  },
});