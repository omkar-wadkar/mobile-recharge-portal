const express = require('express');
const router = express.Router();
const { register, login, googleLogin, requestOTP, verifyOTP } = require('../Controller/authController');
const { protect } = require('../Middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/request-otp', protect, requestOTP);
router.post('/verify-otp', protect, verifyOTP);

module.exports = router;
