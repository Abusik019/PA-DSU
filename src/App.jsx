import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Aside } from "./components/Aside";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Group from "./pages/Group";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";

function App() {
    return (
        <>
            <Aside />
            <section className="content">
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/authorization" element={<Registration />} />
                    <Route path="/my-groups/:id" element={<Group />}/>
                    <Route path="/groups" element={<Groups />}/>
                    <Route path="/notifications" element={<Notifications />}/>
                </Routes>
            </section>
        </>
    );
}

export default App;
