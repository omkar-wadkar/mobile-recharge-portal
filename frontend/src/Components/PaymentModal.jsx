import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import paymentService from '../Services/paymentService';

const PaymentModal = ({ plan, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [referralCode, setReferralCode] = useState('');

    const isDiscounted = referralCode === 'offer21';
    const finalPrice = isDiscounted ? Math.max(0, plan.price - 50) : plan.price;

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Create Order on Backend
            const orderData = await paymentService.createOrder({
                planId: plan._id,
                amount: finalPrice,
                referralCode: isDiscounted ? referralCode : undefined
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: orderData.key_id, // Enter the Key ID generated from the Dashboard
                amount: orderData.amount, // Amount is in currency subunits. Default currency is INR.
                currency: "INR",
                name: "Mobile Recharge Portal",
                description: `Recharge for ${plan.validity}`,
                order_id: orderData.order_id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (response) {
                    try {
                        // 3. Verify Payment on Backend
                        const verifyRes = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        onSuccess(verifyRes.transaction);

                    } catch (verifyError) {
                        console.error("Verification Error", verifyError);
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: "User Name", // You might want to pass user details if available
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2563EB"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

            rzp1.on('payment.failed', function (response) {
                setError(`Payment Failed: ${response.error.description}`);
                setLoading(false);
            });

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Payment initiation failed');
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

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100 italic">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:scale-95 disabled:bg-blue-300 flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            'Pay with Razorpay'
                        )}
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            Secured by Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
