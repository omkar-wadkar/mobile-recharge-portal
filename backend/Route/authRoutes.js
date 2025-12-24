const express = require('express');
const router = express.Router();
const { register, login, googleLogin, requestOTP, verifyOTP, forgotPassword, verifyForgotOTP, resetPassword } = require('../Controller/authController');
const { protect } = require('../Middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/request-otp', protect, requestOTP);
router.post('/verify-otp', protect, verifyOTP);

// Forgot Password Flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-otp', verifyForgotOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
