const express = require('express');
const router = express.Router();
const paymentController = require('../Controller/paymentController');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/create-order', authMiddleware, paymentController.createPaymentOrder);
router.post('/verify', authMiddleware, paymentController.verifyPayment);

module.exports = router;
