import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";

export const store = configureStore({
  reducer: {
    auth,
  },
});