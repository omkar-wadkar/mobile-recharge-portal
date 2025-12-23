import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user/recharge';

const paymentService = {
    initiatePayment: async (paymentData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/initiate`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    confirmPayment: async (paymentData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/confirm`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
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
        const response = await axios.get('http://localhost:5000/api/company/transactions', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default paymentService;
