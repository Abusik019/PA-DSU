import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    token: "",
    loading: false,
    error: null,
};

// Registration
export const registration = createAsyncThunk("auth/registration", async (data) => {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("is_teacher", data.isTeacher);

    try {
        const response = await axios.post(`${API_URL}/users/register`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", 
            },
        });

        if (response.status !== 201) {
            throw new Error("Ошибка регистрации");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка регистрации:", error); 
        throw error;
    }
})

// Login
export const login = createAsyncThunk("auth/login", async (data) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, {"username": data.username, "password": data.password}, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 201) {
            throw new Error("Ошибка входа");
        }

        const token = response.data.access_token;  
        localStorage.setItem("access_token", token);

        const expirationTime = 24 * 60 * 60 * 1000;
        setTimeout(() => {
            localStorage.removeItem("access_token");
        }, expirationTime);

        return await token;
    } catch (error) {
        console.error("Ошибка входа:", error); 
        throw error;
    }
})

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        // registation
        builder.addCase(registration.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(registration.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(registration.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
        // login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(login.fulfilled, (state, action) => {
            state.token = action.payload;

            state.loading = false;
            state.error = null;
        });

        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export const { setAuth } = AuthSlice.actions;

export default AuthSlice.reducer;