import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: {},
    news: {},
    loading: false,
    error: null,
};

// Create News
export const createNews = createAsyncThunk('news/createNews', async ({ image, title, content, category, timeToRead  }) => {
    const formdata = new FormData();

    formdata.append('title', title);
    formdata.append('text', content);
    formdata.append('category_id', category.value);
    formdata.append('time_to_read', timeToRead);

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
        const response = await axios.get(`${API_URL}/news`);

        if(response.status !== 200){
            throw new Error('Ошибка получения новостей')
        }

        return response.data;
    } catch(error){
        console.error("Ошибка получения новостей:", error); 
        throw error;
    }
})

// Get One News
export const getOneNews = createAsyncThunk('news/getOneNews', async (id) => {
    try{
        const response = await axios.get(`${API_URL}/news/${id}`);

        if(response.status !== 200){
            throw new Error('Ошибка получения новости')
        }

        return response.data;
    } catch(error){
        console.error("Ошибка получения новости:", error); 
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

// Update News
export const updateNews = createAsyncThunk('news/updateNews', async ({ id, image, title, text }) => {
    const formdata = new FormData();

    if (image) {
        formdata.append('image', image);
    }  
    if (title) {
        formdata.append('title', title);
    }   
    if (text) {
        formdata.append('text', text);
    }   

    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/news/${id}`, formdata, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if(response.status !== 200){
            throw new Error('Ошибка изменения новости')
        }

        return response.data;
    } catch(error){
        console.error("Ошибка изменения новости:", error); 
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
            // get one news
            .addCase(getOneNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOneNews.fulfilled, (state, action) => {
                state.loading = false;
                state.news = action.payload;
            })
            .addCase(getOneNews.rejected, (state, action) => {
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
            })

            // update news
            .addCase(updateNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNews.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { setNews } = NewsSlice.actions;

export default NewsSlice.reducer;
