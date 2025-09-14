import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    list: [],
    result: {},
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

// Delete exam
export const deleteExam = createAsyncThunk("exams/deleteExam", async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.delete(`${API_URL}/exams/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 204) {
                throw new Error("Ошибка удаления теста");
            }
        
        } catch (error) {
            console.error("Ошибка удаления теста:", error);
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

// Delete question
export const deleteQuestion = createAsyncThunk(
    "exams/deleteQuestion",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.delete(`${API_URL}/exams/delete-question/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 204) {
                throw new Error("Ошибка удаления вопроса");
            }

            return { id };
        } catch (error) {
            console.error("Ошибка удаления вопроса:", error);
            throw error;
        }
    }
);

// Delete text question
export const deleteTextQuestion = createAsyncThunk(
    "exams/deleteTextQuestion",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.delete(`${API_URL}/exams/delete-text-question/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 204) {
                throw new Error("Ошибка удаления вопроса");
            }

            return { id };
        } catch (error) {
            console.error("Ошибка удаления вопроса:", error);
            throw error;
        }
    }
);

// Delete answer
export const deleteAnswer = createAsyncThunk(
    "exams/deleteAnswer",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.delete(`${API_URL}/exams/delete-answer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 204) {
                throw new Error("Ошибка удаления вопроса");
            }

            return { id };
        } catch (error) {
            console.error("Ошибка удаления вопроса:", error);
            throw error;
        }
    }
);

// Pass exam
export const passExam = createAsyncThunk("exams/passExam", async ({ id, exam }) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post(`${API_URL}/exams/pass-exam/${id}`, exam, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 201) {
                throw new Error("Ошибка отправки экзамена");
            }

            return await response.data;
        } catch (error) {
            console.error("Ошибка отправки экзамена:", error);
            throw error;
        }
    }
);

// Get exam result
export const getResultExam = createAsyncThunk(
    "exams/getResultExam",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/exams/get-result/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

// Get exam result by user
export const getResultExamByUser = createAsyncThunk(
    "exams/getResultExamByUser",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/exams/get-results-by-user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

// Get results by exam
export const getResultsByExam = createAsyncThunk(
    "exams/getResultsByExam",
    async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/exams/get-results-by-exam/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

// Get passed answers by user
export const getPassedAnswersByUser = createAsyncThunk(
    "exams/getPassedAnswersByUser",
    async ({ userID, examID }) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${API_URL}/exams/get-passed-answers-by-user/${userID}/${examID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

// Update result
export const updateResult = createAsyncThunk(
    "exams/updateResult",
    async ({ resultID, score }) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.patch(`${API_URL}/exams/update-result/${resultID}`, { score }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                throw new Error("Ошибка обновления данных");
            }

            return response.data;
        } catch (error) {
            console.error("Ошибка обновления данных:", error);
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
        builder
        // create exam
        .addCase(createExam.pending, (state) => {
            state.loading = true;
        })

        .addCase(createExam.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })

        .addCase(createExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // delete exam
        .addCase(deleteExam.pending, (state) => {
            state.loading = true;
        })
    
        .addCase(deleteExam.fulfilled, (state, action) => {
            state.list = state.list.filter(exam => exam.id !== action.meta.arg);
            state.loading = false;
            state.error = null;
        })
    
        .addCase(deleteExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // get teacher exams
        .addCase(getTeacherExams.pending, (state) => {
            state.loading = true;
        })

        .addCase(getTeacherExams.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getTeacherExams.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // get group exams
        .addCase(getGroupExams.pending, (state) => {
            state.loading = true;
        })

        .addCase(getGroupExams.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getGroupExams.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // get exam
        .addCase(getExam.pending, (state) => {
            state.loading = true;
        })

        .addCase(getExam.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // update exam
        .addCase(updateExam.pending, (state) => {
            state.loading = true;
        })

        .addCase(updateExam.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })

        .addCase(updateExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // delete question
        .addCase(deleteQuestion.pending, (state) => {
            state.loading = true;
        })

        .addCase(deleteQuestion.fulfilled, (state, action) => {
            const removedId = action.payload?.id ?? action.meta.arg;

            const updateQuestions = (exam) => ({
                ...exam,
                questions: Array.isArray(exam.questions)
                    ? exam.questions.filter(q => q.id !== removedId)
                    : exam.questions,
            });

            if (Array.isArray(state.list)) {
                state.list = state.list.map(updateQuestions);
            } else if (state.list && typeof state.list === 'object') {
                state.list = updateQuestions(state.list);
            }
            state.loading = false;
            state.error = null;
        })

        .addCase(deleteQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // delete text question
        .addCase(deleteTextQuestion.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteTextQuestion.fulfilled, (state, action) => {
            const removedId = action.payload?.id ?? action.meta.arg;

            const updateTextQuestions = (exam) => ({
                ...exam,
                text_questions: Array.isArray(exam.text_questions)
                    ? exam.text_questions.filter(q => q.id !== removedId)
                    : exam.text_questions,
            });

            if (Array.isArray(state.list)) {
                state.list = state.list.map(updateTextQuestions);
            } else if (state.list && typeof state.list === 'object') {
                state.list = updateTextQuestions(state.list);
            }
            state.loading = false;
            state.error = null;
        })
        .addCase(deleteTextQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // delete answer
        .addCase(deleteAnswer.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteAnswer.fulfilled, (state, action) => {
            const removedId = action.payload?.id ?? action.meta.arg;

            const updateAnswers = (exam) => ({
                ...exam,
                questions: Array.isArray(exam.questions)
                    ? exam.questions.map(question => ({
                        ...question,
                        answers: Array.isArray(question.answers)
                            ? question.answers.filter(a => a.id !== removedId)
                            : question.answers,
                    }))
                    : exam.questions,
            });

            if (Array.isArray(state.list)) {
                state.list = state.list.map(updateAnswers);
            } else if (state.list && typeof state.list === 'object') {
                state.list = updateAnswers(state.list);
            }
            state.loading = false;
            state.error = null;
        })
        .addCase(deleteAnswer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // pass exam
        .addCase(passExam.pending, (state) => {
            state.loading = true;
        })

        .addCase(passExam.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })

        .addCase(passExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // get result exam
        .addCase(getResultExam.pending, (state) => {
            state.loading = true;
        })

        .addCase(getResultExam.fulfilled, (state, action) => {
            state.result = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getResultExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // get result exam by user
        .addCase(getResultExamByUser.pending, (state) => {
            state.loading = true;
        })

        .addCase(getResultExamByUser.fulfilled, (state, action) => {
            state.result = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getResultExamByUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
        
        // get results by exam
        .addCase(getResultsByExam.pending, (state) => {
            state.loading = true;
        })

        .addCase(getResultsByExam.fulfilled, (state, action) => {
            state.result = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getResultsByExam.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })

        // get passed answers by user
        .addCase(getPassedAnswersByUser.pending, (state) => {
            state.loading = true;
        })

        .addCase(getPassedAnswersByUser.fulfilled, (state, action) => {
            state.result = action.payload;
            state.loading = false;
            state.error = null;
        })

        .addCase(getPassedAnswersByUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
    },
});

export const { setExams } = ExamSlice.actions;

export default ExamSlice.reducer;
