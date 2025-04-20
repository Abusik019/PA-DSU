import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    group: {},
    loading: false,
    error: null,
};

// Получение всех групп
export const getAllGroups = createAsyncThunk("groups/getAllGroups", async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/groups`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})

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

        return response.data;
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

        return response.data;
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

        return response.data;
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

        return response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})

// GetMyCreatedGroups
export const getMyCreatedGroups = createAsyncThunk("groups/getMyCreatedGroups", async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/groups/get-my-created-groups`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения данных");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка получения данных:", error); 
        throw error;
    }
})

// ChangeGroup
export const changeGroup = createAsyncThunk("groups/changeGroup", async ({ id, data }) => {
    try {
        const token = localStorage.getItem('access_token');
        const body = Object.entries(data).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
        }, {});

        const response = await axios.patch(`${API_URL}/groups/${id}`, body, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка изменения данных");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка изменения данных:", error); 
        throw error;
    }
})

// DeleteGroup
export const deleteGroup = createAsyncThunk("groups/deleteGroup", async (id) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/groups/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.status !== 204) {
            throw new Error("Ошибка удаления данных");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка удаления данных:", error); 
        throw error;
    }
})

// CreateGroup
export const createGroup = createAsyncThunk("groups/createGroup", async (data) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/groups`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.status === 400) {
            throw new Error("Такая группа уже существует");
        }
        if (response.status !== 201) {
            throw new Error("Ошибка создания группы");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка при создании группы:", error); 
        throw error;
    }
})

// Invite to group
export const inviteToGroup = createAsyncThunk("groups/inviteToGroup", async (id) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/groups/invite/${id}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка получения даннных");
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка получения даннных:", error); 
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
        // Получение всех групп
        builder.addCase(getAllGroups.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getAllGroups.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getAllGroups.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

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

        builder.addCase(kickUser.fulfilled, (state, action) => {
            if (state.group && state.group.members) {
                state.group.members = state.group.members.filter(member => member.id !== action.meta.arg.userId);
            }
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

        // getMyCreatedGroups
        builder.addCase(getMyCreatedGroups.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getMyCreatedGroups.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getMyCreatedGroups.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // changeGroup
        builder.addCase(changeGroup.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(changeGroup.fulfilled, (state, action) => {
            state.group = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(changeGroup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // deleteGroup
        builder.addCase(deleteGroup.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(deleteGroup.fulfilled, (state, action) => {
            state.list = state.list.filter(group => group.id !== action.payload.id);
            state.loading = false;
            state.error = null;
        });

        builder.addCase(deleteGroup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // createGroup
        builder.addCase(createGroup.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(createGroup.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(createGroup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });

        // inviteToGroup
        builder.addCase(inviteToGroup.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(inviteToGroup.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(inviteToGroup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export const { setGroups } = GroupsSlice.actions;

export default GroupsSlice.reducer;