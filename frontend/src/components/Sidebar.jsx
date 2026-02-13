import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, File, Users, Star, Trash2, Settings, Cloud, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api, { setAuthToken } from '../lib/api';

const Sidebar = () => {
    const { currentUser, logout } = useAuth();

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            await setAuthToken();
            const amount = 500; // INR
            const response = await api.post('/payments/create-order', { amount });
            // The backend might return a parsed object or a JSON string
            const order = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount.toString(),
                currency: order.currency,
                name: "CloudShare Pro",
                description: "Upgrade to 100GB Storage",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const data = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        };
                        await setAuthToken();
                        const verifyResult = await api.post('/payments/verify', data);
                        if (verifyResult.data) {
                            alert("Payment Successful! You are now a Pro member.");
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (e) {
                        console.error("Verification Error:", e);
                        alert("Payment Verification Failed: " + (e.response?.data || e.message));
                    }
                },
                prefill: {
                    name: currentUser?.email?.split('@')[0],
                    email: currentUser?.email,
                },
                theme: {
                    color: "#2563EB"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            const errorMsg = error.response?.data || error.message;
            alert("Payment failed: " + errorMsg);
        }
    };

    const navItems = [
        { name: 'My Files', icon: Home, path: '/dashboard' },
        { name: 'Recent', icon: File, path: '/dashboard/recent' },
        { name: 'Shared', icon: Users, path: '/dashboard/shared' },
        { name: 'Favorites', icon: Star, path: '/dashboard/favorites' },
        { name: 'Trash', icon: Trash2, path: '/dashboard/trash' },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 flex items-center border-b border-gray-800">
                <Cloud className="h-8 w-8 text-blue-500 mr-3" />
                <span className="text-xl font-bold">CloudShare</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                end={item.path === '/dashboard'}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="mt-8 pt-8 border-t border-gray-800 px-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Storage
                    </p>
                    <div className="bg-gray-800 rounded-full h-2 w-full mb-2">
                        <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mb-6">
                        <span>7.5 GB used</span>
                        <span>10 GB total</span>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-bold shadow-lg transform transition hover:scale-105"
                    >
                        Upgrade to Pro
                    </button>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
