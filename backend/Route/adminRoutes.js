const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllCompanies, toggleUserStatus, toggleCompanyStatus, createCompany, getPendingProviders, updateProviderStatus } = require('../Controller/adminController');
const { protect, authorize } = require('../Middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/companies', getAllCompanies);
router.post('/companies', createCompany);
router.patch('/users/:id/toggle', toggleUserStatus);
router.patch('/companies/:id/toggle', toggleCompanyStatus);

// New Routes
router.delete('/users/:id', require('../Controller/adminController').deleteUser);
router.delete('/companies/:id', require('../Controller/adminController').deleteCompany);
router.post('/users', require('../Controller/adminController').createUser);
router.get('/plans', require('../Controller/adminController').getAllPlans);
router.get('/transactions', require('../Controller/adminController').getAllTransactions);

// Provider Approval
router.get('/pending-providers', protect, authorize('ADMIN'), getPendingProviders);
router.put('/provider-status/:id', protect, authorize('ADMIN'), updateProviderStatus);

module.exports = router;
