import React from 'react';
import { Outlet } from 'react-router-dom';
import Doshboard from './Doshboard';

const MainLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <Doshboard />
            <main className="flex-1 min-w-0 overflow-x-clip pt-20 lg:pt-0">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
