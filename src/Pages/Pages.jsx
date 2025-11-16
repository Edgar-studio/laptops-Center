import React from 'react';
import { useRoutes } from 'react-router-dom'
import {Admin_routes, Private_routes, Public_routes} from "../Utils/Routes.jsx";

const Pages = () => {
    const token = localStorage.getItem('token');
    return (
        <div className='w-full min-h-[80vh]'>
            {
                useRoutes(
                    token ? (token === 'Admin' ? Admin_routes : Private_routes) : Public_routes,
                )
            }
        </div>
    );
};

export default Pages;