import React from 'react';
import { Calendar, Wifi, Phone, IndianRupee } from 'lucide-react';

const PlanCard = ({ plan, onSelect, isManage = false, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold uppercase tracking-wider">{plan.company?.name || 'Recharge Plan'}</h3>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {plan.status}
                    </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                    <IndianRupee size={20} />
                    <span className="text-3xl font-black">{plan.price}</span>
                </div>
            </div>

            <div className="p-5 space-y-4 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Validity</p>
                            <p className="text-sm font-semibold">{plan.validity}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Wifi size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Data</p>
                            <p className="text-sm font-semibold">{plan.data}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Voice</p>
                        <p className="text-sm font-semibold">{plan.calls}</p>
                    </div>
                </div>

                <p className="text-gray-500 text-sm italic border-t pt-3">
                    {plan.description || "Enjoy seamless connectivity with this plan."}
                </p>
            </div>

            <div className="p-4 bg-gray-50 border-t flex gap-2">
                {isManage ? (
                    <>
                        <button onClick={() => onEdit(plan)} className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-bold hover:bg-blue-200 transition">Edit</button>
                        <button onClick={() => onDelete(plan._id)} className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-bold hover:bg-red-200 transition">Delete</button>
                    </>
                ) : (
                    <button
                        onClick={() => onSelect(plan)}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition transform active:scale-95 shadow-md"
                    >
                        Recharge Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlanCard;
