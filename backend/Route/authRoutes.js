const express = require('express');
const router = express.Router();
const { register, login, googleLogin, requestOTP, verifyOTP, forgotPassword, verifyForgotOTP, resetPassword } = require('../Controller/authController');
const { protect } = require('../Middleware/authMiddleware');

const {
    registerValidation,
    loginValidation,
    requestOtpValidation,
    verifyOtpValidation,
    forgotPasswordValidation,
    verifyForgotOtpValidation,
    resetPasswordValidation,
    refreshTokenValidation
} = require('../validators/auth.validation');
const { validateRequest } = require('../Middleware/validateRequest');

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/google', googleLogin);
router.post('/refresh-token', refreshTokenValidation, validateRequest, require('../Controller/authController').refreshToken);
router.post('/request-otp', protect, requestOtpValidation, validateRequest, requestOTP);
router.post('/verify-otp', protect, verifyOtpValidation, validateRequest, verifyOTP);

// Forgot Password Flow
router.post('/forgot-password', forgotPasswordValidation, validateRequest, forgotPassword);
router.post('/verify-forgot-otp', verifyForgotOtpValidation, validateRequest, verifyForgotOTP);
router.post('/reset-password', resetPasswordValidation, validateRequest, resetPassword);

module.exports = router;
