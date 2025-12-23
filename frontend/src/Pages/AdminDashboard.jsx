import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { Users, Building2, BarChart3, ToggleLeft, ToggleRight, Plus, X, Trash2, LayoutList, Receipt, ArrowRight, AlertTriangle, Check, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, companies: 0, plans: 0, transactions: 0, revenue: 0 });
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [plans, setPlans] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingProviders, setPendingProviders] = useState([]);

    const [activeTab, setActiveTab] = useState('overview');

    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    const [newComp, setNewComp] = useState({ name: '', description: '', contactEmail: '' });
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'USER', mobile: '' });

    const token = React.useMemo(() => localStorage.getItem('token'), []);
    const headers = React.useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    const fetchData = React.useCallback(async () => {
        try {
            const [sRes, uRes, cRes, pRes, tRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', { headers }),
                axios.get('http://localhost:5000/api/admin/users', { headers }),
                axios.get('http://localhost:5000/api/admin/companies', { headers }),
                axios.get('http://localhost:5000/api/admin/plans', { headers }),
                axios.get('http://localhost:5000/api/admin/transactions', { headers })
            ]);
            setStats(sRes.data);
            setUsers(uRes.data);
            setCompanies(cRes.data);
            setPlans(pRes.data);
            setPlans(pRes.data);
            setTransactions(tRes.data);

            const pendingRes = await axios.get('http://localhost:5000/api/admin/pending-providers', { headers });
            setPendingProviders(pendingRes.data);
        } catch (err) {
            console.error(err);
        }
    }, [headers]);

    useEffect(() => {
        Promise.resolve().then(() => fetchData());
    }, [fetchData]);

    const toggleUser = async (id) => {
        await axios.patch(`http://localhost:5000/api/admin/users/${id}/toggle`, {}, { headers });
        fetchData();
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers });
            fetchData();
        }
    };

    const toggleCompany = async (id) => {
        await axios.patch(`http://localhost:5000/api/admin/companies/${id}/toggle`, {}, { headers });
        fetchData();
    };

    const deleteCompany = async (id) => {
        if (window.confirm('Are you sure? This is irreversible.')) {
            await axios.delete(`http://localhost:5000/api/admin/companies/${id}`, { headers });
            fetchData();
        }
    };

    const handleProviderStatus = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this provider?`)) {
            await axios.put(`http://localhost:5000/api/admin/provider-status/${id}`, { status }, { headers });
            fetchData();
        }
    };

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/admin/companies', newComp, { headers });
        setNewComp({ name: '', description: '', contactEmail: '' });
        setShowCompanyModal(false);
        fetchData();
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/admin/users', newUser, { headers });
        setNewUser({ name: '', email: '', password: '', role: 'USER', mobile: '' });
        setShowUserModal(false);
        fetchData();
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${activeTab === id ? 'bg-neutral-900 text-white shadow-lg' : 'bg-white text-neutral-500 hover:bg-neutral-100'}`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />
            <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">System Administration</h1>
                        <p className="text-neutral-500 font-medium">Global control panel for users, providers, and analytics.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
                    <TabButton id="overview" label="Overview" icon={BarChart3} />
                    <TabButton id="users" label="Users" icon={Users} />
                    <TabButton id="companies" label="Providers" icon={Building2} />
                    <TabButton id="requests" label="Requests" icon={AlertTriangle} />
                    <TabButton id="plans" label="All Plans" icon={LayoutList} />
                    <TabButton id="transactions" label="Transactions" icon={Receipt} />
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {[
                                { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Companies', value: stats.companies, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
                                { label: 'Active Plans', value: stats.plans, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
                                { label: 'Transactions', value: stats.transactions, icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
                                { label: 'Total Revenue', value: `₹${stats.revenue}`, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                                    <div className={`${s.bg} ${s.color} p-4 rounded-2xl mb-4`}><s.icon size={28} /></div>
                                    <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-widest mb-1">{s.label}</p>
                                    <p className="text-2xl font-black text-neutral-900">{s.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
                            <h3 className="text-xl font-bold mb-6">Quick Navigation</h3>
                            <div className="flex gap-4">
                                <Link to="/company" className="px-6 py-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition flex items-center gap-2">
                                    View Provider Dashboard <ArrowRight size={18} />
                                </Link>
                                <Link to="/dashboard" className="px-6 py-4 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition flex items-center gap-2">
                                    View User Dashboard <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">User Management</h3>
                            <button onClick={() => setShowUserModal(true)} className="bg-neutral-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-neutral-800 transition">
                                <Plus size={16} /> Add User
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">User</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Role</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Status</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b last:border-0 hover:bg-neutral-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-neutral-800">{u.name}</p>
                                                <p className="text-xs text-neutral-400">{u.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${u.role === 'COMPANY' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => toggleUser(u._id)} className={`${u.isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded text-xs font-bold`}>
                                                    {u.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => deleteUser(u._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'companies' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Provider Management</h3>
                            <button onClick={() => setShowCompanyModal(true)} className="bg-neutral-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-neutral-800 transition">
                                <Plus size={16} /> Add Provider
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Company</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Contact</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Status</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map(c => (
                                        <tr key={c._id} className="border-b last:border-0 hover:bg-neutral-50 transition">
                                            <td className="px-6 py-4 font-bold text-neutral-800">{c.name}</td>
                                            <td className="px-6 py-4 text-sm text-neutral-500">{c.contactEmail}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => toggleCompany(c._id)} className={`${c.isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded text-xs font-bold`}>
                                                    {c.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => deleteCompany(c._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'plans' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b"><h3 className="text-xl font-bold">All Plans</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Provider</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Price</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Validity</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map(p => (
                                        <tr key={p._id} className="border-b last:border-0 hover:bg-neutral-50 transition">
                                            <td className="px-6 py-4 font-bold text-indigo-600">{p.company?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 font-bold">₹{p.price}</td>
                                            <td className="px-6 py-4 text-sm">{p.validity}</td>
                                            <td className="px-6 py-4 text-sm text-neutral-500">{p.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b"><h3 className="text-xl font-bold">All Transactions</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">User</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Provider</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Plan</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Amount</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t._id} className="border-b last:border-0 hover:bg-neutral-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-neutral-800">{t.user?.name || 'Unknown'}</p>
                                                <p className="text-[10px] text-neutral-400">{t.user?.email}</p>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-indigo-600">{t.company?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-sm">{t.plan?.description || 'Plan'}</td>
                                            <td className="px-6 py-4 font-bold">₹{t.amount}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${t.transactionStatus === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {t.transactionStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab === 'requests' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden animate-in fade-in duration-500">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2"><AlertTriangle /> Pending Approvals</h3>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{pendingProviders.length} Pending</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Provider Name</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Email</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400">Applied At</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase text-neutral-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingProviders.length === 0 ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-neutral-400 font-medium">No pending requests.</td></tr>
                                    ) : (
                                        pendingProviders.map(p => (
                                            <tr key={p._id} className="border-b last:border-0 hover:bg-neutral-50 transition">
                                                <td className="px-6 py-4 font-bold text-neutral-800">{p.name}</td>
                                                <td className="px-6 py-4 text-sm text-neutral-500">{p.email}</td>
                                                <td className="px-6 py-4 text-xs text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <button onClick={() => handleProviderStatus(p._id, 'APPROVED')} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm">
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button onClick={() => handleProviderStatus(p._id, 'REJECTED')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition">
                                                        <ShieldAlert size={14} /> Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCompanyModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">Add Provider</h2>
                            <button onClick={() => setShowCompanyModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleCreateCompany} className="space-y-4">
                            <input type="text" placeholder="Company Name" className="w-full p-3 bg-neutral-50 border rounded-xl font-bold" value={newComp.name} onChange={e => setNewComp({ ...newComp, name: e.target.value })} required />
                            <input type="email" placeholder="Contact Email" className="w-full p-3 bg-neutral-50 border rounded-xl" value={newComp.contactEmail} onChange={e => setNewComp({ ...newComp, contactEmail: e.target.value })} required />
                            <textarea placeholder="Description" className="w-full p-3 bg-neutral-50 border rounded-xl" value={newComp.description} onChange={e => setNewComp({ ...newComp, description: e.target.value })}></textarea>
                            <button type="submit" className="w-full bg-neutral-900 text-white py-3 rounded-xl font-bold">Save Company</button>
                        </form>
                    </div>
                </div>
            )}

            {showUserModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">Add User</h2>
                            <button onClick={() => setShowUserModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <input type="text" placeholder="Full Name" className="w-full p-3 bg-neutral-50 border rounded-xl font-bold" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                            <input type="email" placeholder="Email" className="w-full p-3 bg-neutral-50 border rounded-xl" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                            <input type="password" placeholder="Password" className="w-full p-3 bg-neutral-50 border rounded-xl" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                            <input type="text" placeholder="Mobile" className="w-full p-3 bg-neutral-50 border rounded-xl" value={newUser.mobile} onChange={e => setNewUser({ ...newUser, mobile: e.target.value })} />
                            <select className="w-full p-3 bg-neutral-50 border rounded-xl font-bold" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="USER">Standard User</option>
                                <option value="COMPANY">Telecom Provider</option>
                                <option value="ADMIN">System Admin</option>
                            </select>
                            <button type="submit" className="w-full bg-neutral-900 text-white py-3 rounded-xl font-bold">Create User</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
