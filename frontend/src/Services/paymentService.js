import axios from 'axios';

const API_URL = 'https://mobile-recharge-portal-xctb.vercel.app/api/user/recharge';

const NEW_API_URL = 'https://mobile-recharge-portal-xctb.vercel.app/api/payment';

const paymentService = {
    // Legacy support or new naming
    createOrder: async (paymentData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${NEW_API_URL}/create-order`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    verifyPayment: async (paymentData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${NEW_API_URL}/verify`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    // Keeping these for backward compatibility if used elsewhere, but ideally should be replaced
    initiatePayment: async (paymentData) => {
        // Map to createOrder
        return paymentService.createOrder(paymentData);
    },
    confirmPayment: async (paymentData) => {
        // this was likely the old dummy confirmation. Razorpay handles the "confirm" via UI. 
        // But the verification happens on backend.
        return paymentService.verifyPayment(paymentData);
    },
    getHistory: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getCompanyHistory: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://mobile-recharge-portal-xctb.vercel.app/api/company/transactions', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default paymentService;
