import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Aside } from "./components/layouts/Aside";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Group from "./pages/Group";
import Notifications from "./pages/Notifications";
import { useEffect, useState } from "react";
import { checkTokenExpiration } from './utils/checkTokenExpiration';
import MyGroups from "./pages/MyGroups";
import Lectures from "./pages/Lectures";
import CreateLecture from './pages/CreateLecture';
import Lecture from "./pages/Lecture";
import { useDispatch, useSelector } from "react-redux";
import CreateExam from "./pages/CreateExam";
import Exams from "./pages/Exams";
import Exam from "./pages/Exam";
import { NotFound } from "./components/layouts/notFound";
import PassExam from "./pages/PassExam";
// import { PrivateChat } from "./pages/PrivateChat";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import News from './pages/News';
import CreateNews from "./pages/CreateNews";
import Loader from "./components/common/loader";
import { getMyInfo } from "./store/slices/users";

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
    const isTokenValid = checkTokenExpiration();
    return isTokenValid ? children : <Navigate to="/sign-in" />;
};
// Компонент для публичных маршрутов
const PublicRoute = ({ children }) => {
    const isTokenValid = checkTokenExpiration();
    return !isTokenValid ? children : <Navigate to="/" />;
};
// Компонент только для учителей
const TeacherRoute = ({ children, isTeacher }) => {
    if (isTeacher === undefined) return null;
    return isTeacher ? children : <Navigate to="/" />;
};
// Компонент только для админов
const AdminRoute = ({ children, isAdmin }) => {
    if (isAdmin === undefined) return null;
    return isAdmin ? children : <Navigate to="/" />;
};

function App() {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const loading = useSelector((state) => state.users.loading);
    const navigate = useNavigate();

    const [firstLoad, setFirstLoad] = useState(true);
    
    useEffect(() => {
        const isTokenValid = checkTokenExpiration();
        if (!isTokenValid) {
            console.log("Токен истёк, пользователь будет разлогинен.");
            localStorage.removeItem("access_token");
            navigate('/sign-in');
        } else {
            dispatch(getMyInfo()).finally(() => setFirstLoad(false));
        }
    }, [dispatch, navigate]);

    if (firstLoad && loading) {
        return <Loader />;
    }

    console.log(myInfo);

    return (
        <>
            <Aside />
            <section className="content-app">
                <Routes>
                    {/* Маршруты */}
                    <Route 
                        path="*"
                        element={<NotFound />}
                    />
                    <Route 
                        path="/sign-in" 
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        } 
                    />
                    <Route 
                        path="/sign-up" 
                        element={
                            <PublicRoute>
                                <Registration />
                            </PublicRoute>
                        } 
                    />

                    {/* Защищенные маршруты */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/user/:id"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-groups/:id"
                        element={
                            <PrivateRoute>
                                <Group />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-groups"
                        element={
                            <PrivateRoute>
                                <TeacherRoute isTeacher={myInfo.is_teacher}>
                                    <MyGroups />
                                </TeacherRoute>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <PrivateRoute>
                                <Notifications />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/lectures"
                        element={
                            <PrivateRoute>
                                <Lectures />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create-lecture"
                        element={
                            <PrivateRoute>
                                <TeacherRoute isTeacher={myInfo.is_teacher}>
                                    <CreateLecture />
                                </TeacherRoute>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/lecture/:id"
                        element={
                            <PrivateRoute>
                                <Lecture />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create-exam"
                        element={
                            <PrivateRoute>
                                <TeacherRoute isTeacher={myInfo.is_teacher}>
                                    <CreateExam />
                                </TeacherRoute>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/exams"
                        element={
                            <PrivateRoute>
                                <Exams />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/exams/:id"
                        element={
                            <PrivateRoute>
                                <Exam />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/pass-exam/:id"
                        element={
                            <PrivateRoute>
                                <PassExam />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/chats"
                        element={
                            <PrivateRoute>
                                <Chat />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/chats"
                        element={
                            <PrivateRoute>
                                <Chat />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/news"
                        element={
                            <PrivateRoute>
                                <News />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create-news"
                        element={
                            <PrivateRoute>
                                <AdminRoute isAdmin={true}>
                                    <CreateNews />
                                </AdminRoute>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </section>
        </>
    );
}

export default App;
