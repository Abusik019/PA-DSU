import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    loading: false,
    error: null,
};

// Create exam
export const createExam = createAsyncThunk(
    "exams/createExam",
    async (data) => {
        console.log(data);
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post(`${API_URL}/exams`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 201) {
                throw new Error("Ошибка создания теста");
            }

            return await response.data;
        } catch (error) {
            console.error("Ошибка создания теста:", error);
            throw error;
        }
    }
);

// Get exams by teacher
export const getTeacherExams = createAsyncThunk(
    "exams/getTeacherExams",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/exams/get-by-teacher-id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Ошибка получения данных");
            }

            return await response.data;
        } catch (error) {
            console.error("Ошибка получения данных:", error);
            throw error;
        }
    }
);

// Get exams by group
export const getGroupExams = createAsyncThunk(
    "exams/getGroupExams",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/exams/get-by-group-id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Ошибка получения данных");
            }

            return await response.data;
        } catch (error) {
            console.error("Ошибка получения данных:", error);
            throw error;
        }
    }
);

// Get exam
export const getExam = createAsyncThunk(
    "exams/getExam",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/exams/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Ошибка получения данных");
            }

            return await response.data;
        } catch (error) {
            console.error("Ошибка получения данных:", error);
            throw error;
        }
    }
);

// Update exam
export const updateExam = createAsyncThunk(
    "exams/updateExam",
    async ({ id, data }) => {
        console.log(data);
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.patch(`${API_URL}/exams/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Ошибка изменения теста");
            }

            return await response.data;
        } catch (error) {
            console.error("Ошибка изменения теста:", error);
            throw error;
        }
    }
);

const ExamSlice = createSlice({
    name: "exams",
    initialState,
    reducers: {
        setExams: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        // create exam
        builder.addCase(createExam.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(createExam.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(createExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
        // get teacher exams
        builder.addCase(getTeacherExams.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getTeacherExams.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getTeacherExams.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
        // get group exams
        builder.addCase(getGroupExams.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getGroupExams.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getGroupExams.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
        // get exam
        builder.addCase(getExam.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getExam.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(getExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
        // update exam
        builder.addCase(updateExam.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(updateExam.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(updateExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },
});

export const { setExams } = ExamSlice.actions;

export default ExamSlice.reducer;
