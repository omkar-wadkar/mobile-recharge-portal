const nodemailer = require('nodemailer');

const otps = new Map(); // In-memory storage for OTPs. Use Redis in production.

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.generateOTP = (key) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps.set(key, { otp, expires: Date.now() + 600000 }); // 10 mins expiry
    return otp;
};

exports.sendEmailOTP = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mobile Recharge Portal - OTP Verification',
            text: `Your OTP is ${otp}. It expires in 10 minutes.`
        });
        return true;
    } catch (error) {
        console.error('Email OTP Error:', error);
        return false;
    }
};

exports.sendMobileOTP = (mobile, otp) => {
    // Mock mobile OTP service
    console.log(`[MOCK SMS] Sending OTP ${otp} to ${mobile}`);
    return true;
};

exports.verifyOTP = (key, otp) => {
    const data = otps.get(key);
    if (!data) return false;
    if (data.expires < Date.now()) {
        otps.delete(key);
        return false;
    }
    if (data.otp === otp) {
        otps.delete(key);
        return true;
    }
    return false;
};
