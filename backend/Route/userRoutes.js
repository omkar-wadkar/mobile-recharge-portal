const express = require('express');
const router = express.Router();
const { initiatePayment, confirmPayment, getTransactionHistory } = require('../Controller/paymentController');
const { getAllPlans, getPlansByCompany } = require('../Controller/planController');
const { getAllCompanies } = require('../Controller/adminController');
const { protect } = require('../Middleware/authMiddleware');

router.get('/companies', getAllCompanies);
router.get('/plans', getAllPlans);
router.get('/plans/:companyId', getPlansByCompany);

router.use(protect);
router.post('/recharge/initiate', initiatePayment);
router.post('/recharge/confirm', confirmPayment);
router.get('/recharge/history', getTransactionHistory);

module.exports = router;
