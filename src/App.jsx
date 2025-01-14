import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Aside } from "./components/Aside";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Group from "./pages/Group";

function App() {
    return (
        <>
            <Aside />
            <section className="content">
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/authorization" element={<Registration />} />
                    <Route path="/my-groups" element={<Group />}/>
                </Routes>
            </section>
        </>
    );
}

export default App;
