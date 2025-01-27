import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    group: {},
    loading: false,
    error: null,
};

// Get group
export const getGroup = createAsyncThunk("groups/getGroup", async (id) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/groups/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})

// GetMyGroups
export const getMyGroups = createAsyncThunk("groups/getMyGroups", async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/groups/get-my-groups`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})

// Kick user
export const kickUser = createAsyncThunk("groups/kickUser", async ({ groupId, userId }) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/groups/kick-user/${groupId}`, {"users_list": [userId]}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})

// Group Leave
export const groupLeave = createAsyncThunk("groups/groupLeave", async (id) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/groups/group-leave/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return await response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})


const GroupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        setGroups: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getGroup
        builder.addCase(getGroup.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getGroup.fulfilled, (state, action) => {
            state.group = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getGroup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // getMyGroups
        builder.addCase(getMyGroups.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getMyGroups.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getMyGroups.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // kickUser
        builder.addCase(kickUser.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(kickUser.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(kickUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // groupLeave
        builder.addCase(groupLeave.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(groupLeave.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(groupLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export const { setGroups } = GroupsSlice.actions;

export default GroupsSlice.reducer;