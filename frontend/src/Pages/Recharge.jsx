import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import planService from '../Services/planService';
import PlanCard from '../Components/PlanCard';
import PaymentModal from '../Components/PaymentModal';

const Recharge = () => {
    const [plans, setPlans] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        planService.getCompanies().then(setCompanies);
        planService.getAllPlans().then(setPlans);
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            planService.getPlansByCompany(selectedCompany).then(setPlans);
        } else {
            planService.getAllPlans().then(setPlans);
        }
    }, [selectedCompany]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl 2xl:max-w-[1500px] 3xl:max-w-[1800px] 4xl:max-w-[2400px] mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Ready to Recharge?</h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">Choose your operator, pick a plan that fits your needs, and experience lightning fast recharges.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setSelectedCompany('')}
                        className={`px-8 py-3 rounded-2xl font-bold transition flex items-center gap-2 border-2 ${!selectedCompany ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                        All Plans
                    </button>
                    {companies.map(c => (
                        <button
                            key={c._id}
                            onClick={() => setSelectedCompany(c._id)}
                            className={`px-8 py-3 rounded-2xl font-bold transition flex items-center gap-2 border-2 ${selectedCompany === c._id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 gap-8">
                    {plans.map(plan => (
                        <PlanCard
                            key={plan._id}
                            plan={plan}
                            onSelect={(p) => { setSelectedPlan(p); setShowPayment(true); }}
                        />
                    ))}
                </div>
            </div>

            {showPayment && (
                <PaymentModal
                    plan={selectedPlan}
                    onClose={() => setShowPayment(false)}
                    onSuccess={() => { setShowPayment(false); alert('Recharge Successful!'); }}
                />
            )}
        </div>
    );
};

export default Recharge;
