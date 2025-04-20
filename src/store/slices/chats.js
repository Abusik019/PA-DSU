import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    rooms: [],
    loading: false,
    error: null,
};

export const getMyRooms = createAsyncThunk("groups/getMyRooms", async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/chats/private-chats/get-my-rooms`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения комнат");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка получения комнат:", error); 
        throw error;
    }
})

const ChatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Получение всех моих комнат
            .addCase(getMyRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyRooms.fulfilled, (state, action) => {
                state.rooms = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMyRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
    },  
});

export const { setChats } = ChatsSlice.actions;

export default ChatsSlice.reducer;