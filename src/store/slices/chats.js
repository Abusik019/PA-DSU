import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    rooms: [],
    messages: [],
    users: [],
    loading: false,
    error: null,
};

export const getMyRooms = createAsyncThunk("chats/getMyRooms", async () => {
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

export const getPrivateMessages = createAsyncThunk("chats/getPrivateMessages", async (receiver_id) => {
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

export const getGroupMessages = createAsyncThunk("chats/getGroupMessages", async (groupID) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/chats/groups/${groupID}`, {
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

export const deletePrivateMessage = createAsyncThunk("chats/deletePrivateMessage", async (msgID) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/chats/private-chats/${msgID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 204) {
            throw new Error("Ошибка удаления сообщения");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка удаления сообщения:", error); 
        throw error;
    }
})

export const deleteGroupMessage = createAsyncThunk("chats/deleteGroupMessage", async (msgID) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/chats/groups/${msgID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 204) {
            throw new Error("Ошибка удаления сообщения");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка удаления сообщения:", error); 
        throw error;
    }
})

export const updatePrivateMessage = createAsyncThunk("chats/updatePrivateMessage", async ({ id, text }) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/chats/private-chats/${id}`, { text }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка изменения сообщения");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка изменения сообщения:", error); 
        throw error;
    }
})

export const updateGroupMessage = createAsyncThunk("chats/updateGroupMessage", async ({ id, text }) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/chats/groups/${id}`, { text }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка изменения сообщения");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка изменения сообщения:", error); 
        throw error;
    }
})

export const getUsersWhoCheckMessage = createAsyncThunk("chats/getUsersWhoCheckMessage", async (id) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/chats/groups/get-checks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения списка пользователей которые прочитали сообщение");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка получения списка пользователей которые прочитали сообщение:", error); 
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
            // Получение всех групповых сообщений
            .addCase(getGroupMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGroupMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getGroupMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            // Удаление сообщения с личного чата
            .addCase(deletePrivateMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePrivateMessage.fulfilled, (state, action) => {
                // action.meta.arg содержит msgID, так как thunk вызывается как deletePrivateMessage(msgID)
                state.messages = state.messages?.filter(msg => msg.id !== action.meta.arg);
                state.loading = false;
                state.error = null;
            })
            .addCase(deletePrivateMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            // Удаление сообщения с группового чата
            .addCase(deleteGroupMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGroupMessage.fulfilled, (state, action) => {
                state.messages = state.messages?.filter(msg => msg.id !== action.meta.arg);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteGroupMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            // Изменение сообщения личного чата
            .addCase(updatePrivateMessage.fulfilled, (state, action) => {
                const updatedMsg = action.payload;
                const index = state.messages.findIndex(msg => msg.id === updatedMsg.id);
                
                if (index !== -1) {
                    state.messages[index] = updatedMsg;
                }
                state.loading = false;
                state.error = null;
            })
            // Изменение сообщения группового чата
            .addCase(updateGroupMessage.fulfilled, (state, action) => {
                const updatedMsg = action.payload;
                const index = state.messages.findIndex(msg => msg.id === updatedMsg.id);
                
                if (index !== -1) {
                    state.messages[index] = updatedMsg;
                }
                state.loading = false;
                state.error = null;
            })
            // Получение списка пользователей которые прочитали сообщение
             .addCase(getUsersWhoCheckMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUsersWhoCheckMessage.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUsersWhoCheckMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
        },  
});

export const { setChats } = ChatsSlice.actions;

export default ChatsSlice.reducer;