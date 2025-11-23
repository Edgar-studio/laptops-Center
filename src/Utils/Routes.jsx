import Login from "../Pages/Public Pages/Login.jsx";
import Register from "../Pages/Public Pages/Register.jsx";
import { Navigate } from "react-router-dom";
import Home from "../Pages/Private Pages/Home.jsx";
import About from "../Pages/Private Pages/About.jsx";
import History from "../Pages/Private Pages/History.jsx";
import Products from "../Pages/Private Pages/Products.jsx";
import UsersControl from "../Pages/Admin Pages/UsersControl.jsx";
import ProductsControl from "../Pages/Admin Pages/ProductsControl.jsx";

export const LOGIN_PAGE = "/login"
export const REGISTER_PAGE = "/register"


export const HOME_PAGE = "/"
export const ABOUT_PAGE = "/about"
export const HISTORY_PAGE = "/history"
export const PRODUCTS_PAGE = "/products"


export const USERS_CONTROL_PAGE = "/userscontrol"
export const PRODUCTS_CONTROL_PAGE = "/productscontrol"

export const Public_routes = [
    {path: LOGIN_PAGE, element: <Login />, name: "Login"},
    {path: REGISTER_PAGE, element: <Register />, name: "Register"},
    {path: '*', element: <Navigate to={LOGIN_PAGE} />},
]


export const Private_routes = [
    {path: HOME_PAGE, element: <Home />, name: "Home" },
    {path: ABOUT_PAGE, element: <About />, name: "About" },
    {path: HISTORY_PAGE, element: <History />, name: "History" },
    {path: PRODUCTS_PAGE, element: <Products />},

    {path: '*', element: <Navigate to={HOME_PAGE} />},
]


export const Admin_routes = [
    {path: USERS_CONTROL_PAGE, element:<UsersControl />, name: "Users Control"},
    {path: PRODUCTS_CONTROL_PAGE, element: <ProductsControl />, name: "Products Control"},
    {path: "*", element: <Navigate to={USERS_CONTROL_PAGE} />},
]