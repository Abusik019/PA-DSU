import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from './store/store';
import { ScreenWidthProvider } from "./providers/ScreenWidthProvider.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Provider store={store}>
            <ScreenWidthProvider debounceMs={100}>
                <App /> 
            </ScreenWidthProvider>
        </Provider>
    </BrowserRouter>
);
