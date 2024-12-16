import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Aside } from "./components/Aside";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Authorization from "./pages/Authorization";

function App() {
    return (     
        <>
            <Aside />
            <section className="content">
                <Routes>
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/authorization" element={<Authorization />}/>
                </Routes>
            </section>
        </>
    )
}

export default App;
