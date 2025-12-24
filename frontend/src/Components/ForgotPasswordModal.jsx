import React, { useState } from 'react';
import { X, Mail, Key, Lock, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import authService from '../Services/authService';

const ForgotPasswordModal = ({ onClose }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.forgotPassword(email);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await authService.verifyForgotOTP(email, otp);
            setResetToken(data.resetToken);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.resetPassword(resetToken, newPassword);
            setSuccessMsg('Password reset successfully! You can now login.');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Reset Password</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {successMsg ? (
                        <div className="text-center py-8">
                            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-800">Success!</h3>
                            <p className="text-gray-600 mt-2">{successMsg}</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100 italic">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {step === 1 && (
                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <p className="text-gray-600 text-sm">Enter your registered email address to receive an OTP.</p>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleOtpSubmit} className="space-y-4">
                                    <p className="text-gray-600 text-sm">Enter the 6-digit OTP sent to <strong>{email}</strong>.</p>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Enter OTP"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition tracking-widest"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Verify & Proceed'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full text-gray-500 text-sm font-medium hover:text-gray-700"
                                    >
                                        Back to Email
                                    </button>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <p className="text-gray-600 text-sm">Enter your new password.</p>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength="6"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
