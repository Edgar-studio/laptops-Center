import {BrowserRouter} from 'react-router-dom'
import {createRoot} from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import {store} from "./Toolkit/store.js";
import {ToastContainer} from "react-toastify";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
            <ToastContainer />
        </BrowserRouter>
    </Provider>
)
