import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    lecture: {},
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
export const createLecture = createAsyncThunk('lectures/createLecture', async ({ title, text, file, groups }) => {
    const formdata = new FormData();

    formdata.append('title', title);
    formdata.append('groups', JSON.stringify(groups));

    if (file) {
        formdata.append('file', file);
    } else {
        formdata.append('text', text);
    }    

    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/materials`, formdata, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if(response.status !== 201){
            throw new Error('Ошибка создания лекции')
        }

        return await response.data;
    } catch(error){
        console.error("Ошибка создания лекции:", error); 
        throw error;
    }
})

// Get My Lectures
export const getMyLectures = createAsyncThunk('lectures/getMyLectures', async () => {
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/materials/get-my-lectures`, {
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

// Get Lecture
export const getLecture = createAsyncThunk('lectures/getLecture', async (id) => {
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/materials/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if(response.status !== 200){
            throw new Error('Ошибка получения лекции')
        }

        return await response.data;
    } catch(error){
        console.error("Ошибка получения лекции:", error); 
        throw error;
    }
})

// Delete Lecture
export const deleteLecture = createAsyncThunk('lectures/deleteLecture', async (id) => {
    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/materials/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if(response.status !== 204){
            throw new Error('Ошибка удаления лекции')
        }

        return await response.data;
    } catch(error){
        console.error("Ошибка удаления лекции:", error); 
        throw error;
    }
})

// Update Lecture
export const updateLecture = createAsyncThunk('lectures/updateLecture', async ({ id, lecture }) => {
    const formdata = new FormData();

    formdata.append('title', lecture.title);
    formdata.append('groups', JSON.stringify(lecture.groups));

    if(lecture.file){
        formdata.append('file', lecture.file);
    } else{
        formdata.append('text', lecture.text);
    }

    try{
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/materials/${id}`, formdata, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
                }
            }
        );

        if(response.status !== 200){
            throw new Error('Ошибка изменения лекции')
        }

        return await response.data;
    } catch(error){
        console.error("Ошибка изменения лекции:", error); 
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
        builder
        // getLectures
        .addCase(getLectures.pending, (state) => {
            state.loading = true;
        })

        .addCase(getLectures.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getLectures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // createLecture
        .addCase(createLecture.pending, (state) => {
            state.loading = true;
        })
        
        .addCase(createLecture.fulfilled, (state, action) => {
            if (action.payload && action.payload.id) {
                state.list.unshift(action.payload);
            }
            state.loading = false;
            state.error = null;
        })

        .addCase(createLecture.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
        
        // getMyLectures
        .addCase(getMyLectures.pending, (state) => {
            state.loading = true;
        })

        .addCase(getMyLectures.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        })
    
        .addCase(getMyLectures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // getLecture
        .addCase(getLecture.pending, (state) => {
            state.loading = true;
        })
    
        .addCase(getLecture.fulfilled, (state, action) => {
            state.lecture = action.payload;
            state.loading = false;
            state.error = null;
        })
    
        .addCase(getLecture.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // deleteLecture
        .addCase(deleteLecture.pending, (state) => {
            state.loading = true;
        })
    
        .addCase(deleteLecture.fulfilled, (state, action) => {
            state.list = state.list.filter(lecture => lecture.id !== action.meta.arg);
            state.loading = false;
            state.error = null;
        })
    
        .addCase(deleteLecture.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // updateLecture
        .addCase(updateLecture.pending, (state) => {
            state.loading = true;
        })
    
        .addCase(updateLecture.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
    
        .addCase(updateLecture.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
    },
});

export const { setLectures } = LecturesSlice.actions;

export default LecturesSlice.reducer;