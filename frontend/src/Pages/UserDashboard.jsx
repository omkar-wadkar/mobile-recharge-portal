import React, { useState, useEffect } from 'react';
import authService from '../Services/authService';
import planService from '../Services/planService';
import paymentService from '../Services/paymentService';
import Navbar from '../Components/Navbar';
import PlanCard from '../Components/PlanCard';
import PaymentModal from '../Components/PaymentModal';
import { ShieldCheck, ShieldAlert, History, CreditCard, CheckCircle2, Clock } from 'lucide-react';

const UserDashboard = () => {
    const [user] = useState(authService.getCurrentUser());
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [plans, setPlans] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [compRes, histRes] = await Promise.all([
                    planService.getCompanies(),
                    paymentService.getHistory()
                ]);
                setCompanies(compRes);
                setHistory(histRes);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            planService.getPlansByCompany(selectedCompany).then(setPlans);
        } else {
            planService.getAllPlans().then(setPlans);
        }
    }, [selectedCompany]);

    const handleRechargeSuccess = () => {
        setShowPayment(false);
        setSelectedPlan(null);
        alert('Recharge successful!');
        paymentService.getHistory().then(setHistory);
    };

    const handleVerify = async (type) => {
        const otp = prompt(`Enter OTP sent to your ${type}:`);
        if (otp) {
            try {
                await authService.verifyOTP(type, otp);
                alert(`${type} verified!`);
                window.location.reload();
            } catch {
                alert('Verification failed');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl 2xl:max-w-[1500px] 3xl:max-w-[1800px] 4xl:max-w-[2400px] mx-auto px-4 py-8">
                {/* Profile Verification Strip */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 flex flex-wrap gap-6 items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Hello, <span className="text-blue-600">{user.name}</span>
                        </h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold ${user.isVerified?.email ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {user.isVerified?.email ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                            Email {user.isVerified?.email ? 'Verified' : 'Pending'}
                            {!user.isVerified?.email && <button onClick={() => { authService.requestOTP('email'); handleVerify('email'); }} className="underline ml-2">Verify Now</button>}
                        </div>
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold ${user.isVerified?.mobile ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {user.isVerified?.mobile ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                            Mobile {user.isVerified?.mobile ? 'Verified' : 'Pending'}
                            {!user.isVerified?.mobile && <button onClick={() => { authService.requestOTP('mobile'); handleVerify('mobile'); }} className="underline ml-2">Verify Now</button>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Recharge Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Available Plans</h3>
                                <select
                                    className="bg-white border rounded-lg px-4 py-2 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                >
                                    <option value="">All Operators</option>
                                    {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-6">
                                {plans.map(plan => (
                                    <PlanCard
                                        key={plan._id}
                                        plan={plan}
                                        onSelect={(p) => { setSelectedPlan(p); setShowPayment(true); }}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: History */}
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight mb-6 flex items-center gap-2">
                            <History size={24} className="text-blue-600" /> Recent History
                        </h3>
                        <div className="space-y-4">
                            {history.length > 0 ? history.map(h => (
                                <div key={h._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${h.transactionStatus === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {h.transactionStatus === 'SUCCESS' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">₹{h.amount}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{h.company?.name || 'SIM'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-[10px] text-gray-400 font-medium">
                                        {new Date(h.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <History size={48} className="mx-auto text-gray-200 mb-2" />
                                    <p className="text-gray-400 font-medium">No recharges yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showPayment && <PaymentModal plan={selectedPlan} onClose={() => setShowPayment(false)} onSuccess={handleRechargeSuccess} />}
        </div>
    );
};

export default UserDashboard;
