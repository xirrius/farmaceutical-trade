import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./state/authSlice";
import messageReducer from "./state/messageSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer
  },
});

export default store;
