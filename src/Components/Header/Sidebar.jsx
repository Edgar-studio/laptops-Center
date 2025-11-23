import React from "react";
import SidebarLib from "react-sidebar";
import { Home, AlignLeft, Clock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ icon, label, onClick }) => (
    <div
        onClick={onClick}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition"
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </div>
);

const MySidebar = ({ toggle, open }) => {
    const navigate = useNavigate();

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
                            <SidebarItem
                                icon={<Home size={20} />}
                                label="Home"
                                onClick={() => navigate("/")}
                            />
                            <SidebarItem
                                icon={<Clock size={20} />}
                                label="History"
                                onClick={() => navigate("/history")}
                            />
                            <SidebarItem
                                icon={<Info size={20} />}
                                label="About"
                                onClick={() => navigate("/about")}
                            />
                        </div>
                    </div>
                }
            />
        </>
    );
};

export default MySidebar;
