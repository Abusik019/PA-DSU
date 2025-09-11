import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: {},
    user: {},
    loading: false,
    error: null,
};

// Get my info
export const getMyInfo = createAsyncThunk("users/getMyInfo", async () => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}/users/get-me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка получения моих данных:", error);
        throw error;
    }
});

// Get user info
export const getUser = createAsyncThunk("users/getUser", async (id) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка получения пользователя:", error);
        throw error;
    }
});

// Change my info
export const changeMyInfo = createAsyncThunk("users/changeMyInfo", async (data) => {
    const formData = new FormData();

    if (data.image) {
        formData.append("image", data.image);
    }
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);

    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.patch(`${API_URL}/users`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Ошибка изменения данных";
        console.error("Ошибка изменения данных:", errorMessage);
        throw new Error(errorMessage);
    }
});

// Forgot Password
export const forgotPassword = createAsyncThunk("users/forgotPassword", async (email) => {
    try {
        const response = await axios.post(`${API_URL}/users/forgot-password`, { email }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Ошибка сброса пароля";
        console.error("Ошибка сброса пароля:", errorMessage);
        throw new Error(errorMessage);
    }
});

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.list = action.payload;
        },
        clearUserState: (state) => {
            state.list = [];
            state.user = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getMyInfo
            .addCase(getMyInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyInfo.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(getMyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })

            // getUser
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })

            // changeMyInfo
            .addCase(changeMyInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeMyInfo.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(changeMyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })

             // forgotPassword
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export const { setUsers, clearUserState } = usersSlice.actions;

export default usersSlice.reducer;
