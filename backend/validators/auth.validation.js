const { body } = require('express-validator');

exports.registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number must be numeric')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits'),
    body('role')
        .optional()
        .isIn(['USER', 'COMPANY']).withMessage('Role must be either USER or COMPANY')
        .custom((value) => {
            if (value === 'ADMIN') {
                throw new Error('Role cannot be ADMIN');
            }
            return true;
        })
];

exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
];

exports.requestOtpValidation = [
    body('type')
        .trim()
        .notEmpty().withMessage('Type is required')
        .isIn(['email', 'mobile']).withMessage('Type must be either email or mobile')
];

exports.verifyOtpValidation = [
    body('type')
        .trim()
        .notEmpty().withMessage('Type is required')
        .isIn(['email', 'mobile']).withMessage('Type must be either email or mobile'),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isNumeric().withMessage('OTP must be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
];

exports.forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

];

exports.verifyForgotOtpValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isNumeric().withMessage('OTP must be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
];

exports.resetPasswordValidation = [
    body('resetToken')
        .trim()
        .notEmpty().withMessage('Reset Token is required')
        .isJWT().withMessage('Invalid Reset Token format'),
    body('newPassword')
        .notEmpty().withMessage('New Password is required')
        .isLength({ min: 6 }).withMessage('New Password must be at least 6 characters long')
];
