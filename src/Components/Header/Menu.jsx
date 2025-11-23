import React, {useEffect, useState} from 'react';
import {Admin_routes, Private_routes, Public_routes} from "../../Utils/Routes.jsx";
import {useLocation, useNavigate} from "react-router-dom";

const SidebarItem = ({icon, label, onClick}) => (
    <div
        onClick={onClick}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition"
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </div>
);
const Menu = () => {
    const [menuItems, setMenuItems] = useState([])
    const token = localStorage.getItem("token");
   useEffect(() => {
       const elements = ( token ? (token === "Admin" ? Admin_routes : Private_routes) : Public_routes)
       setMenuItems(elements.filter((item) => item.name))
   }, [token])
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="">
            {menuItems.map((item, index) => (
                <SidebarItem

                    icon={item.icon}
                    key={index}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 rounded-md transition-colors duration-200
                        ${location.pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-200 hover:bg-gray-700 hover:text-white'}`}
                    label={item.name}
                />

            ))}
        </nav>
    );
};

export default Menu;
