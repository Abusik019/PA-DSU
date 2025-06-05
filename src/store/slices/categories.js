import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: {},
    loading: false,
    error: null,
};

// Get Categories
export const getCategories = createAsyncThunk('categories/getCategories', async () => {
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if(response.status !== 200){
            throw new Error('Ошибка получения категорий')
        }

        console.log(response.data);
        return response.data;
    } catch(error){
        console.error("Ошибка получения категорий:", error); 
        throw error;
    }
})


const CategoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getCategories.fulfilled, (state, action) => {  
            state.loading = false;
            state.list = action.payload;
        })
        .addCase(getCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    },
});

export const { setCategories } = CategoriesSlice.actions;

export default CategoriesSlice.reducer;
