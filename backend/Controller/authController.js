const User = require('../Models/Schema/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verifyGoogleToken } = require('../Service/oauthService');
const { generateOTP, sendEmailOTP, sendMobileOTP, verifyOTP } = require('../Service/otpService');

const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role,
        companyRef: user.companyRef,
        name: user.name,
        isVerified: user.isVerified
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, mobile } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const approvalStatus = role === 'COMPANY' ? 'PENDING' : 'APPROVED';

        user = new User({ name, email, password, role, mobile, approvalStatus });
        await user.save();

        const otp = generateOTP(email);
        await sendEmailOTP(email, otp);

        const token = generateToken(user);

        let message = 'Registration successful';
        if (approvalStatus === 'PENDING') {
            message = 'Registration successful. Please wait for admin approval.';
        }

        res.status(201).json({ token, user: { id: user._id, name, email, role, approvalStatus }, message });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

        // Check Approval Status
        if (user.approvalStatus === 'PENDING') {
            return res.status(403).json({ message: 'Your account is pending approval from Admin.' });
        }
        if (user.approvalStatus === 'REJECTED') {
            return res.status(403).json({ message: 'Your account application was rejected.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        const googleUser = await verifyGoogleToken(idToken);
        if (!googleUser) return res.status(401).json({ message: 'Invalid Google token' });

        let user = await User.findOne({ email: googleUser.email });
        if (!user) {
            user = new User({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                role: 'USER', // Default for OAuth
                isVerified: { email: true, mobile: false }
            });
            await user.save();
        }

        const token = generateToken(user);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.requestOTP = async (req, res) => {
    try {
        const { type } = req.body; // 'email' or 'mobile'
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generateOTP(type === 'email' ? user.email : user.mobile);
        if (type === 'email') await sendEmailOTP(user.email, otp);
        else sendMobileOTP(user.mobile, otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { type, otp } = req.body;
        const user = await User.findById(req.user.id);
        const key = type === 'email' ? user.email : user.mobile;

        if (verifyOTP(key, otp)) {
            user.isVerified[type] = true;
            await user.save();

            const token = generateToken(user);
            return res.json({ message: `${type} verified successfully`, isVerified: user.isVerified, token });
        }
        res.status(400).json({ message: 'Invalid or expired OTP' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
