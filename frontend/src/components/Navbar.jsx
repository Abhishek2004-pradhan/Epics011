import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10 w-[calc(100%-16rem)]">
            <div className="flex items-center">
                {/* Mobile menu button (hidden on desktop for now, can be implemented for responsiveness) */}
                <button className="md:hidden mr-4" onClick={toggleSidebar}>
                    <Menu className="h-6 w-6 text-gray-600" />
                </button>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out w-64"
                        placeholder="Search files..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600 hidden md:block">{currentUser?.email}</span>
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Bell className="h-6 w-6" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
