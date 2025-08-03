import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "./store/slices/users";
import { Aside } from "./components/layouts/Aside";
import Loader from "./components/common/loader";
import { usePreloadComponents } from "./utils";
import ErrorBoundary from "./components/common/errorBoundary";
import { checkTokenExpiration } from './utils';

const Profile = lazy(() => import("./pages/Profile"));
const Group = lazy(() => import("./pages/Group"));
const MyGroups = lazy(() => import("./pages/MyGroups"));
const Lectures = lazy(() => import("./pages/Lectures"));
const CreateLecture = lazy(() => import('./pages/CreateLecture'));
const Lecture = lazy(() => import("./pages/Lecture"));
const CreateExam = lazy(() => import("./pages/CreateExam"));
const Exams = lazy(() => import("./pages/Exams"));
const Exam = lazy(() => import("./pages/Exam"));
const PassExam = lazy(() => import("./pages/PassExam"));
const Chat = lazy(() => import("./pages/Chat"));
const Home = lazy(() => import("./pages/Home"));
const News = lazy(() => import('./pages/News'));
const CreateNews = lazy(() => import("./pages/CreateNews"));
const OneNews = lazy(() => import("./pages/OneNews"));
const UpdateNews = lazy(() => import("./pages/UpdateNews"));
const NotFound = lazy(() => import("./components/layouts/NotFound"));

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
    const isTokenValid = checkTokenExpiration();
    return isTokenValid ? children : <Navigate to="/" replace />;
};

// Мемоизированные компоненты для роли-зависимых маршрутов
const TeacherRoute = ({ children, isTeacher }) => {
    const content = useMemo(() => {
        if (isTeacher === undefined) return null;
        return isTeacher ? children : <Navigate to="/" replace />;
    }, [children, isTeacher]);
    
    return content;
};

const AdminRoute = ({ children, isAdmin }) => {
    const content = useMemo(() => {
        if (isAdmin === undefined) return null;
        return isAdmin ? children : <Navigate to="/" replace />;
    }, [children, isAdmin]);
    
    return content;
};

function App() {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    
    const isTokenValid = checkTokenExpiration();
    
    const componentsToPreload = useMemo(() => [
        () => import("./pages/Home"),
        () => import("./pages/Profile"),
        () => import("./pages/Lectures"),
        () => import("./pages/News"),
    ], []);

    
    usePreloadComponents(componentsToPreload);
    
    const getUserInfo = useCallback(() => {
        if (isTokenValid) {
            dispatch(getMyInfo());
        }
    }, [dispatch, isTokenValid]);
    
    useEffect(() => {
        if (!isTokenValid) {
            localStorage.removeItem("access_token");
        } else {
            getUserInfo();
        }
    }, [isTokenValid, getUserInfo]);

    const routes = useMemo(() => (
        <Routes>
            {/* Маршруты */}
            <Route 
                path="*"
                element={<NotFound />}
            />
            <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="/news"
                element={<News />}
            />
            <Route
                path="/news/:id"
                element={<OneNews />}
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
                        <TeacherRoute isTeacher={myInfo.is_teacher}>
                            <MyGroups />
                        </TeacherRoute>
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
                path="/create-news"
                element={
                    <PrivateRoute>
                        <AdminRoute isAdmin={myInfo.is_superuser}>
                            <CreateNews />
                        </AdminRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/update-news/:id"
                element={
                    <PrivateRoute>
                        <AdminRoute isAdmin={myInfo.is_superuser}>
                            <UpdateNews />
                        </AdminRoute>
                    </PrivateRoute>
                }
            />
        </Routes>
    ), [myInfo.is_teacher, myInfo.is_superuser]);

    return (
        <>
            <Aside />
            <section className="content-app">
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        {routes}
                    </Suspense>
                </ErrorBoundary>
            </section>
        </>
    );
}

export default App;
