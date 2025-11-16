import React from 'react';
import { useDispatch } from "react-redux";
import { logout } from "../../Toolkit/Slices/AuthSlice.js";
import Menu from "./Menu.jsx";

const Header = () => {
    const dispatch = useDispatch();

    return (
        <header className='w-full h-[10vh] bg-gray-800 flex justify-between items-center px-6 shadow-md'>
            <div className="text-white font-bold text-xl">
                Admin Dashboard
            </div>

            <Menu />

            <button
                onClick={() => dispatch(logout())}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
                Logout
            </button>
        </header>
    );
};

export default Header;
