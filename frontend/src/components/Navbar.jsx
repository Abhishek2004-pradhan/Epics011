import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-20 w-[calc(100%-16rem)]">
            <div className="flex items-center flex-1">
                <button className="md:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={toggleSidebar}>
                    <Menu className="h-6 w-6 text-gray-600" />
                </button>

                <div className="relative max-w-md w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        placeholder="Quick search (⌘K)"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">Pro Member</span>
                </div>
                <div className="h-8 w-[1px] bg-gray-100 hidden lg:block"></div>
                <button className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
