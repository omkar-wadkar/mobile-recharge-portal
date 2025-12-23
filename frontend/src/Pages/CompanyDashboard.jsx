import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../Services/authService';
import planService from '../Services/planService';
import paymentService from '../Services/paymentService';
import Navbar from '../Components/Navbar';
import PlanCard from '../Components/PlanCard';
import { Plus, List, Wallet, LayoutGrid, X, Building2 } from 'lucide-react';

const CompanyDashboard = () => {
    const user = authService.getCurrentUser();
    const [plans, setPlans] = useState([]);
    const [history, setHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({ price: '', validity: '', data: '', calls: '', description: '' });

    const [showOnboarding, setShowOnboarding] = useState(false);
    const [newCompany, setNewCompany] = useState({ name: '', description: '', contactEmail: '' });

    useEffect(() => {
        if (!user.companyRef) {
            setShowOnboarding(true);
        } else {
            planService.getPlansByCompany(user.companyRef).then(setPlans);
            paymentService.getCompanyHistory().then(setHistory);
        }
    }, [user.companyRef]);

    const handleOnboarding = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/company/profile', newCompany, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem('token', res.data.token);
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create company profile');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPlan) {
                await planService.updatePlan(editingPlan._id, formData);
            } else {
                await planService.createPlan(formData);
            }
            setShowModal(false);
            setEditingPlan(null);
            setFormData({ price: '', validity: '', data: '', calls: '', description: '' });
            planService.getPlansByCompany(user.companyRef).then(setPlans);
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await planService.deletePlan(id);
            setPlans(plans.filter(p => p._id !== id));
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({ price: plan.price, validity: plan.validity, data: plan.data, calls: plan.calls, description: plan.description });
        setShowModal(true);
    };

    if (showOnboarding) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-center">
                    <div className="bg-blue-600 p-8 text-white">
                        <Building2 size={48} className="mx-auto mb-4" />
                        <h1 className="text-3xl font-black">Welcome, Partner!</h1>
                        <p className="text-blue-100 mt-2">Let's set up your Telecom Company profile to get started.</p>
                    </div>
                    <form onSubmit={handleOnboarding} className="p-8 space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400">Company Name</label>
                            <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="e.g. Acme Net" value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400">Contact Email</label>
                            <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium" placeholder="support@acme.com" value={newCompany.contactEmail} onChange={e => setNewCompany({ ...newCompany, contactEmail: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400">Description</label>
                            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[100px]" placeholder="Tell us about your services..." value={newCompany.description} onChange={e => setNewCompany({ ...newCompany, description: e.target.value })}></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition shadow-xl mt-4">
                            Create Profile & Start
                        </button>
                        <p className="text-center mt-4 text-slate-400 text-sm">
                            Already registered a company?
                            <button onClick={() => { authService.logout(); window.location.href = '/login'; }} className="text-blue-600 font-bold ml-1 hover:underline">
                                Log in again to refresh
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl 2xl:max-w-[1500px] 3xl:max-w-[1800px] 4xl:max-w-[2400px] mx-auto px-4 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Provider Dashboard</h1>
                        <p className="text-slate-500">Manage your recharge plans and view sales</p>
                    </div>
                    <button
                        onClick={() => { setEditingPlan(null); setFormData({ price: '', validity: '', data: '', calls: '', description: '' }); setShowModal(true); }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 transition"
                    >
                        <Plus size={20} /> Create New Plan
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Total Plans</p>
                        <p className="text-3xl font-black text-slate-800">{plans.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Total Sales</p>
                        <p className="text-3xl font-black text-slate-800">₹{history.reduce((acc, h) => acc + (h.transactionStatus === 'SUCCESS' ? h.amount : 0), 0)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Subscribers</p>
                        <p className="text-3xl font-black text-slate-800">{[...new Set(history.map(h => h.user))].length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Active Now</p>
                        <p className="text-3xl font-black text-green-500">{plans.filter(p => p.status === 'ACTIVE').length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><LayoutGrid className="text-blue-500" /> Your Recharge Plans</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-6">
                            {plans.map(plan => (
                                <PlanCard key={plan._id} plan={plan} isManage={true} onEdit={handleEdit} onDelete={handleDelete} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Wallet className="text-blue-500" /> Recent Sales</h3>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase">User</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase">Plan</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.slice(0, 10).map(h => (
                                        <tr key={h._id} className="border-b last:border-0 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-slate-700 text-sm">{h.user?.name || 'Customer'}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-slate-700 text-sm">₹{h.amount}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${h.transactionStatus === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {h.transactionStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
                            <h2 className="text-2xl font-black">{editingPlan ? 'Update Plan' : 'Create New Plan'}</h2>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-400">Price (INR)</label>
                                    <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-400">Validity</label>
                                    <input type="text" placeholder="e.g. 28 Days" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={formData.validity} onChange={e => setFormData({ ...formData, validity: e.target.value })} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-400">Data Allowance</label>
                                    <input type="text" placeholder="e.g. 1.5GB/Day" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-400">Calls</label>
                                    <input type="text" placeholder="e.g. Unlimited" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={formData.calls} onChange={e => setFormData({ ...formData, calls: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-400">Description</label>
                                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Optional plan details..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition shadow-xl active:scale-[0.98]">
                                {editingPlan ? 'Save Changes' : 'Launch Plan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyDashboard;
