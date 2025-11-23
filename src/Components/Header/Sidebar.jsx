import React from "react";
import SidebarLib from "react-sidebar";
import {AlignLeft } from "lucide-react";
import Menu from "./Menu.jsx";
import {logout} from "../../Toolkit/Slices/AuthSlice.js";
import {useDispatch} from "react-redux";



const MySidebar = ({ toggle, open }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    return (
        <>
            {open && (
                <div
                    onClick={toggle}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 cursor-pointer transition-opacity duration-300"
                />
            )}

            <SidebarLib
                styles={{
                    sidebar: {
                        background: "rgb(17 24 39)",
                        transition: "transform 0.35s ease",
                    },
                    root: {
                        position: "fixed",
                        height: "100%",
                        zIndex: 40,
                        pointerEvents: open ? "auto" : "none",
                    },
                    content: { overflow: "hidden" },
                }}
                open={open}
                onSetOpen={toggle}
                sidebar={
                    <div className="w-64 h-full bg-gray-900 text-white p-4 flex flex-col gap-4">
                        <button
                            onClick={toggle}
                            className="p-2 bg-gray-800 text-white rounded-full w-10 h-10 flex justify-center items-center mb-4 hover:bg-gray-700 transition"
                        >
                            <AlignLeft size={22} />
                        </button>

                        <div className="flex flex-col gap-3">
                            <Menu />
                        </div>

                        {
                            token &&  <button
                                onClick={() => dispatch(logout())}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        }
                    </div>
                }
            />
        </>
    );
};

export default MySidebar;
