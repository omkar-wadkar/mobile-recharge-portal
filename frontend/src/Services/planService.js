import axios from 'axios';

const API_USER_URL = 'http://localhost:5000/api/user/plans';
const API_COMP_URL = 'http://localhost:5000/api/company/plans';

const planService = {
    getAllPlans: async () => {
        const response = await axios.get(API_USER_URL);
        return response.data;
    },
    getPlansByCompany: async (companyId) => {
        const response = await axios.get(`${API_USER_URL}/${companyId}`);
        return response.data;
    },
    createPlan: async (planData) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_COMP_URL, planData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    updatePlan: async (id, planData) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_COMP_URL}/${id}`, planData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    deletePlan: async (id) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_COMP_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getCompanies: async () => {
        const response = await axios.get('http://localhost:5000/api/user/companies');
        return response.data;
    }
};

export default planService;
