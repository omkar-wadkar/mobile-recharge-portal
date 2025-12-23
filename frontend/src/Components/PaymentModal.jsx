import React, { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import paymentService from '../Services/paymentService';

const PaymentModal = ({ plan, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [method, setMethod] = useState('CARD');
    const [details, setDetails] = useState({ cardNumber: '', expiry: '', cvv: '', upiId: '' });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [referralCode, setReferralCode] = useState('');

    const isDiscounted = referralCode === 'offer21';
    const finalPrice = isDiscounted ? Math.max(0, plan.price - 50) : plan.price;

    const handleInitiate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await paymentService.initiatePayment({
                planId: plan._id,
                paymentMethod: method,
                paymentDetails: details
            });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await paymentService.confirmPayment({
                planId: plan._id,
                paymentMethod: method,
                paymentDetails: details,
                otp,
                referralCode: isDiscounted ? referralCode : undefined
            });
            onSuccess(res.transaction);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment confirmation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Secure Checkout</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition"><X /></button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Amount to Pay</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black text-blue-700">₹{finalPrice}</p>
                                {isDiscounted && <p className="text-sm text-gray-400 line-through">₹{plan.price}</p>}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-700">{plan.validity}</p>
                            <p className="text-xs text-gray-500">{plan.data}</p>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Have a referral code?"
                                className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-bold ${isDiscounted ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-200'}`}
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                            />
                            {isDiscounted && <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><CheckCircle size={12} /> Code verified! ₹50 saved.</p>}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100 italic">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleInitiate} className="space-y-4">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMethod('CARD')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition ${method === 'CARD' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <CreditCard size={18} /> Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMethod('UPI')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition ${method === 'UPI' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <Smartphone size={18} /> UPI
                                </button>
                            </div>

                            {method === 'CARD' ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Card Number (16 Digits)"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        maxLength="16"
                                        value={details.cardNumber}
                                        onChange={(e) => setDetails({ ...details, cardNumber: e.target.value })}
                                        required
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={details.expiry}
                                            onChange={(e) => setDetails({ ...details, expiry: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="password"
                                            placeholder="CVV"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            maxLength="3"
                                            value={details.cvv}
                                            onChange={(e) => setDetails({ ...details, cvv: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="bg-yellow-50 p-2 text-[10px] text-yellow-700 rounded border border-yellow-100">
                                        <strong>Test Cards:</strong> 4111... (Success) | 4000... (Failure)
                                    </div>
                                </>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="yourname@upi"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={details.upiId}
                                    onChange={(e) => setDetails({ ...details, upiId: e.target.value })}
                                    required
                                />
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:scale-95 disabled:bg-blue-300"
                            >
                                {loading ? 'Processing...' : 'Proceed to Verify'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleConfirm} className="space-y-4">
                            <div className="text-center">
                                <p className="text-gray-600 mb-2">We've sent a 6-digit OTP to your email.</p>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="w-full p-4 text-center text-3xl font-black tracking-[1em] rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                            >
                                {loading ? 'Verifying...' : 'Pay Now'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm font-medium hover:text-gray-700"
                            >
                                Back to details
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
