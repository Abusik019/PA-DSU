import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    loading: false,
    error: null,
};

// Create News
export const createNews = createAsyncThunk('news/createNews', async ({ image, title, text }) => {
    const formdata = new FormData();

    formdata.append('title', title);
    formdata.append('text ', text);

    if (image) {
        formdata.append('image', image);
    }   

    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/news`, formdata, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if(response.status !== 201){
            throw new Error('Ошибка создания новости')
        }

        return await response.data;
    } catch(error){
        console.error("Ошибка создания новости:", error); 
        throw error;
    }
})


const NewsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        setNews: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNews.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(createNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setNews } = NewsSlice.actions;

export default NewsSlice.reducer;
