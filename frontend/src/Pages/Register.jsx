import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../Services/authService';
import { UserPlus, Mail, Lock, User, Phone, Briefcase, Loader2, Chrome } from 'lucide-react';

const GOOGLE_CLIENT_ID = '120955983800-kvvgasi9uag3rmgpr29qnrhrsvjgpsi7.apps.googleusercontent.com';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', mobile: '', role: 'USER' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleResponse = async (response) => {
        setLoading(true);
        setError('');
        try {
            const data = await authService.googleLogin(response.credential);
            if (data.user.role === 'ADMIN') navigate('/admin');
            else if (data.user.role === 'COMPANY') navigate('/company');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-up failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initialize Google Sign-In with button render
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
                auto_select: false,
                cancel_on_tap_outside: true
            });

            // Render the button
            const buttonDiv = document.getElementById('google-signup-button');
            if (buttonDiv) {
                window.google.accounts.id.renderButton(
                    buttonDiv,
                    {
                        theme: 'outline',
                        size: 'large',
                        width: '100%',
                        text: 'signup_with'
                    }
                );
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await authService.register(formData);
            if (data.message && data.message.includes('wait for admin approval')) {
                alert(data.message);
                navigate('/login');
                return;
            }
            if (data.user.role === 'ADMIN') navigate('/admin');
            else if (data.user.role === 'COMPANY') navigate('/company');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-blue-600 tracking-tight">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join our portal today</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg italic border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="Full Name"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Email Address"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            placeholder="Mobile Number"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                        <select
                            name="role"
                            value={formData.role}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none transition"
                            onChange={handleChange}
                        >
                            <option value="USER">Standard User</option>
                            <option value="COMPANY">Telecom Provider (Company)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400 font-medium">Or sign up with</span></div>
                </div>

                <div id="google-signup-button" className="w-full flex justify-center"></div>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
