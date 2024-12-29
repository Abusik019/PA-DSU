import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Aside } from "./components/Aside";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import classNames from "classnames";
import { useState } from "react";
import Registration from "./pages/Registration";

function App() {
    // const items = [
    //     {id: 1, title: 'Title 1', description: 'Description 1'},
    //     {id: 2, title: 'Title 1', description: 'Description 1'},
    //     {id: 3, title: 'Title 1', description: 'Description 1'},
    // ]

    const [checkState, setCheckState] = useState(false);
    const [checkState1, setCheckState1] = useState(false);

    return (
        <>
            {/* <div className="p-4 sm:p-6 lg:p-8 w-full">
                            <h1 className="text-2xl font-bold mb-4 text-center">Example</h1>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((item) => (
                                    <li key={item.id} className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <h2 className="text-lg font-semibold">{item.title}</h2>
                                        <p className="text-gray-600 mt-2">{item.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div> */}

            {/* <p
                className={classNames("border p-4 rounded-xl border-black", {
                    "bg-green-500": checkState && checkState1,
                    "bg-red-500": !checkState && !checkState1,
                })}
            >
                Some text
            </p>
            <input
                type="checkbox"
                checked={checkState}
                onChange={(e) => setCheckState(e.target.checked)}
            />
            <input
                type="checkbox"
                checked={checkState1}
                onChange={(e) => setCheckState1(e.target.checked)}
            /> */}

            <Aside />
            <section className="content">
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/authorization" element={<Registration />} />
                </Routes>
            </section>
        </>
    );
}

export default App;
