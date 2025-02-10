import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    loading: false,
    error: null,
};

// Get Lectures
export const getLectures = createAsyncThunk('lectures/getLectures', async (id) => {
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/materials/get-all-lectures/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if(response.status !== 200){
            throw new Error('Ошибка получения лекций')
        }

        return await response.data;
    } catch(error){
        console.error("Ошибка получения лекций:", error); 
        throw error;
    }
})

// Create Lectures
export const createLecture = createAsyncThunk('lectures/createLecture', async (data) => {
    const formdata = new FormData();
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/materials`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if(response.status !== 200){
            throw new Error('Ошибка создания лекции')
        }

        return await response.data;
    } catch(error){
        console.error("Ошибка создания лекции:", error); 
        throw error;
    }
})

const LecturesSlice = createSlice({
    name: "lectures",
    initialState,
    reducers: {
        setLectures: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getLectures
        builder.addCase(getLectures.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getLectures.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getLectures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // createLecture
        builder.addCase(createLecture.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(createLecture.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(createLecture.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export const { setLectures } = LecturesSlice.actions;

export default LecturesSlice.reducer;