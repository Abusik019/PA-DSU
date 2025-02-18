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
    },
});

export const { setExams } = ExamSlice.actions;

export default ExamSlice.reducer;
