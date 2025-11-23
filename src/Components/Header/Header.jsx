import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Toolkit/Slices/AuthSlice";
import Menu from "./Menu";
import MySidebar from "./Sidebar";
import { AlignLeft } from "lucide-react";

const Header = () => {
    const [open, setOpen] = useState(false);

    const toggleSidebar = () => setOpen(!open);

    return (
        <>
            <MySidebar open={open} toggle={toggleSidebar} />

            <header className="w-full h-[10vh] bg-gray-800 flex justify-between items-center px-6 shadow-md relative">

                <button
                    onClick={toggleSidebar}
                    className="absolute left-4 p-2 bg-gray-900 text-white rounded-full w-10 h-10 flex justify-center items-center hover:bg-gray-700 transition"
                >
                    <AlignLeft size={22} />
                </button>

            </header>
        </>
    );
};

export default Header;
