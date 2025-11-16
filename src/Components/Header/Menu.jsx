import React from 'react';
import { Admin_routes, Private_routes, Public_routes } from "../../Utils/Routes.jsx";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
    const token = localStorage.getItem("token");
    const menuItems = token ? (token === "Admin" ? Admin_routes : Private_routes) : Public_routes;
    const location = useLocation();

    return (
        <nav className="flex gap-6">
            {menuItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.path}
                    className={`px-3 py-2 rounded-md transition-colors duration-200
                        ${location.pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-200 hover:bg-gray-700 hover:text-white'}`}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
};

export default Menu;
