import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./userSlice"; 

const store = configureStore({
  reducer: {
    counter: counterReducer, 
  },
});
export default store;