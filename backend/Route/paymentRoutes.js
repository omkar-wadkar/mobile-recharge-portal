const express = require('express');
const router = express.Router();
const paymentController = require('../Controller/paymentController');
const { protect } = require('../Middleware/authMiddleware');

router.post('/create-order', protect, paymentController.createPaymentOrder);
router.post('/verify', protect, paymentController.verifyPayment);

module.exports = router;
