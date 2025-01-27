import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    loading: false,
    error: null,
};

// Get notifications
export const getNotifications = createAsyncThunk("notifications/getNotifications", async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/notifications/get-all-notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})

// Get unread notifications
export const getUnreadNotifications = createAsyncThunk("notifications/getUnreadNotifications", async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/notifications/get-unread-notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})


const NotificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getNotifications
        builder.addCase(getNotifications.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getNotifications.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getNotifications.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // getUnreadNotifications
        builder.addCase(getUnreadNotifications.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getUnreadNotifications.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getUnreadNotifications.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export const { setNotifications } = NotificationsSlice.actions;

export default NotificationsSlice.reducer;