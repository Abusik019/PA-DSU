import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    user: [],
    loading: false,
    error: null,
};

// Get my info
export const getMyInfo = createAsyncThunk("users/getMyInfo", async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/users/get-me`, {
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

// Get user info
export const getUser = createAsyncThunk("users/getUser", async (id) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/users/${id}`, {
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

// Change my info
export const changeMyInfo = createAsyncThunk("users/changeMyInfo", async (data) => {
    const formData = new FormData();
    const token = localStorage.getItem('access_token');

    if (data.image) {
        formData.append("image", data.image);
    }
    
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);

    try {
        const response = await axios.patch(`${API_URL}/users`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", 
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка изменения данных");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка изменения данных:", error); 
        throw error;
    }
})


const UsersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getMyInfo
        builder.addCase(getMyInfo.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getMyInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // getUser
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // Change my info
        builder.addCase(changeMyInfo.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(changeMyInfo.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(changeMyInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export const { setUsers } = UsersSlice.actions;

export default UsersSlice.reducer;