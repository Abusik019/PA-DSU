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

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
    const isTokenValid = checkTokenExpiration();

    return isTokenValid ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const isTokenValid = checkTokenExpiration();

    return !isTokenValid ? children : <Navigate to="/" />;
};

function App() {
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
                </Routes>
            </section>
        </>
    );
}

export default App;
