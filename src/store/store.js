import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import users from './slices/users';
import groups from "./slices/groups";
import notifications from "./slices/notifications";
import lectures from "./slices/lectures";
import exams from './slices/exams';
import chats from './slices/chats';
import news from './slices/news';
import categories from './slices/categories';

export const store = configureStore({
  reducer: {
    auth,
    users,
    groups,
    notifications,
    lectures,
    exams,
    chats,
    news,
    categories
  },
});