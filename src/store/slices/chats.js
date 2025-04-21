import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    rooms: [],
    messages: [],
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

export const getPrivateMessages = createAsyncThunk("groups/getPrivateMessages", async (receiver_id) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/chats/private-chats/${receiver_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения сообщений");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка получения сообщений:", error); 
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
            // Получение всех личных сообщений
            .addCase(getPrivateMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPrivateMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPrivateMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
    },  
});

export const { setChats } = ChatsSlice.actions;

export default ChatsSlice.reducer;