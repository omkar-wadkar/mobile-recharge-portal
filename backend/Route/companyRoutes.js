const express = require('express');
const router = express.Router();
const { createPlan, updatePlan, deletePlan, getPlansByCompany } = require('../Controller/planController');
const { getCompanyTransactions } = require('../Controller/paymentController');
const { protect, authorize } = require('../Middleware/authMiddleware');

router.use(protect);
router.use(authorize('COMPANY', 'ADMIN'));

const { createMyCompany, getMyCompany } = require('../Controller/companyProfileController');

router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);
router.get('/plans/:companyId', getPlansByCompany);
router.get('/transactions', getCompanyTransactions);

// Profile
router.post('/profile', createMyCompany);
router.get('/profile', getMyCompany);

module.exports = router;
