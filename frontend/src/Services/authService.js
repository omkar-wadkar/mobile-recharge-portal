import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        if (response.data.token) localStorage.setItem('token', response.data.token);
        return response.data;
    },
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.token) localStorage.setItem('token', response.data.token);
        return response.data;
    },
    googleLogin: async (idToken) => {
        const response = await axios.post(`${API_URL}/google`, { idToken });
        if (response.data.token) localStorage.setItem('token', response.data.token);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    },
    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch {
            return null;
        }
    },
    requestOTP: async (type) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/request-otp`, { type }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    verifyOTP: async (type, otp) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/verify-otp`, { type, otp }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    }
};

export default authService;
