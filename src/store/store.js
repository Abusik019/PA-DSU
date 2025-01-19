import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import users from './slices/users';
import groups from "./slices/groups";
import notifications from "./slices/notifications";

export const store = configureStore({
  reducer: {
    auth,
    users,
    groups,
    notifications
  },
});