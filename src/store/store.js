import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import users from './slices/users';

export const store = configureStore({
  reducer: {
    auth,
    users
  },
});