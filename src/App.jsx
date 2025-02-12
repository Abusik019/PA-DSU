import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Aside } from "./components/layouts/Aside";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Group from "./pages/Group";
import Notifications from "./pages/Notifications";
import { useEffect } from "react";
import { checkTokenExpiration } from './utils/checkTokenExpiration';
import MyGroups from "./pages/MyGroups";
import Lectures from "./pages/Lectures";
import CreateLecture from './pages/CreateLecture';
import Lecture from "./pages/Lecture";
import { useSelector } from "react-redux";

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
    const isTokenValid = checkTokenExpiration();

    return isTokenValid ? children : <Navigate to="/login" />;
};
// Компонент для публичных маршрутов
const PublicRoute = ({ children }) => {
    const isTokenValid = checkTokenExpiration();

    return !isTokenValid ? children : <Navigate to="/" />;
};
// Компонент только для учителей
const TeacherRoute = ({ children, isTeacher }) => {
    return isTeacher ? children : <Navigate to="/" />;
}

function App() {
    const myInfo = useSelector((state) => state.users.list);
    
    useEffect(() => {
        const isTokenValid = checkTokenExpiration();
        if (!isTokenValid) {
            console.log("Токен истёк, пользователь будет разлогинен.");
            localStorage.removeItem("access_token");
        }
    }, []);

    return (
        <>
            <Aside />
            <section className="content">
                <Routes>
                    {/* Маршруты */}
                    <Route 
                        path="/login" 
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        } 
                    />
                    <Route 
                        path="/authorization" 
                        element={
                            <PublicRoute>
                                <Registration />
                            </PublicRoute>
                        } 
                    />

                    {/* Защищенные маршруты */}
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
                                <MyGroups />
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
                </Routes>
            </section>
        </>
    );
}

export default App;
