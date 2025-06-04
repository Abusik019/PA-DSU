import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: {},
    loading: false,
    error: null,
};

// Create News
export const createNews = createAsyncThunk('news/createNews', async ({ image, title, text }) => {
    const formdata = new FormData();

    formdata.append('title', title);
    formdata.append('text', text);

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

        return response.data;
    } catch(error){
        console.error("Ошибка создания новости:", error); 
        throw error;
    }
})

// Get News
export const getNews = createAsyncThunk('news/getNews', async () => {
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/news`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if(response.status !== 200){
            throw new Error('Ошибка получения новостей')
        }

        console.log(response.data);
        return response.data;
    } catch(error){
        console.error("Ошибка получения новостей:", error); 
        throw error;
    }
})

// Delete News
export const deleteNews = createAsyncThunk('news/deleteNews', async (id) => {
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/news/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if(response.status !== 204){
            throw new Error('Ошибка удаления новостей')
        }

        return response.data;
    } catch(error){
        console.error("Ошибка удаления новостей:", error); 
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
            // create news
            .addCase(createNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNews.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // get news
            .addCase(getNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNews.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // delete news
            .addCase(deleteNews.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteNews.fulfilled, (state, action) => {
                state.list = {
                    ...state.list,
                    results: state.list.results.filter(news => news.id !== action.meta.arg)
                }
                state.loading = false;
                state.error = null;
            })

            .addCase(deleteNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export const { setNews } = NewsSlice.actions;

export default NewsSlice.reducer;
