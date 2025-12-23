import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../Services/authService';
import { LogOut, User, LayoutDashboard, Database, Smartphone } from 'lucide-react';

const Navbar = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
            <div className="max-w-7xl 2xl:max-w-[1500px] 3xl:max-w-[1800px] 4xl:max-w-[2400px] mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                    <Smartphone className="w-8 h-8" />
                    <span className="hidden sm:inline">SIM Recharge</span>
                </Link>

                <div className="flex items-center gap-4 sm:gap-6">
                    {user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="flex items-center gap-1 hover:text-blue-200 transition">
                                    <Database size={18} />
                                    <span className="hidden md:inline">Admin</span>
                                </Link>
                            )}
                            {user.role === 'COMPANY' && (
                                <Link to="/company" className="flex items-center gap-1 hover:text-blue-200 transition">
                                    <LayoutDashboard size={18} />
                                    <span className="hidden md:inline">Dashboard</span>
                                </Link>
                            )}
                            {user.role === 'USER' && (
                                <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-200 transition">
                                    <User size={18} />
                                    <span className="hidden md:inline">Dashboard</span>
                                </Link>
                            )}
                            <button onClick={handleLogout} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition text-sm">
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-200 transition font-medium">Login</Link>
                            <Link to="/register" className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-bold hover:bg-blue-50 transition shadow-md">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
