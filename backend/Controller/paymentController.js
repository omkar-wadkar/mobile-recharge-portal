const Transaction = require('../Models/Schema/Transaction');
const Plan = require('../Models/Schema/Plan');
const { validateCard, validateUPI } = require('../Service/paymentService');
const { generateOTP, sendEmailOTP, verifyOTP } = require('../Service/otpService');
const User = require('../Models/Schema/User');

exports.initiatePayment = async (req, res) => {
    try {
        const { planId, paymentMethod, paymentDetails } = req.body;
        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const user = await User.findById(req.user.id);

        // Validation
        let validationResult;
        if (paymentMethod === 'CARD') {
            validationResult = validateCard(paymentDetails.cardNumber, paymentDetails.expiry, paymentDetails.cvv);
        } else {
            validationResult = validateUPI(paymentDetails.upiId);
        }

        if (!validationResult.valid) {
            return res.status(400).json({ message: validationResult.message });
        }

        // Send OTP for payment confirmation
        const otp = generateOTP(`payment_${user.email}`);
        await sendEmailOTP(user.email, otp);

        res.json({ message: 'Payment OTP sent to email', intent: 'VERIFY_OTP' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { planId, paymentMethod, paymentDetails, otp, referralCode } = req.body;
        const user = await User.findById(req.user.id);

        if (!verifyOTP(`payment_${user.email}`, otp)) {
            return res.status(400).json({ message: 'Invalid or expired Payment OTP' });
        }

        const plan = await Plan.findById(planId);

        let status = 'SUCCESS';
        if (paymentMethod === 'CARD' && paymentDetails.cardNumber === '4000000000000000') {
            status = 'FAILURE';
        }

        let finalAmount = plan.price;
        if (referralCode === 'offer21') {
            finalAmount = Math.max(0, finalAmount - 50);
        }

        const transaction = new Transaction({
            user: user._id,
            plan: plan._id,
            company: plan.company,
            amount: finalAmount,
            paymentMethod,
            transactionStatus: status,
            paymentDetails: paymentMethod === 'CARD' ? { last4: paymentDetails.cardNumber.slice(-4) } : { upiId: paymentDetails.upiId },
            referralCode
        });

        await transaction.save();

        if (status === 'SUCCESS') {
            res.json({ message: 'Recharge successful', transaction });
        } else {
            res.status(400).json({ message: 'Payment failed', transaction });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const query = req.user.role === 'USER' ? { user: req.user.id } :
            req.user.role === 'COMPANY' ? { company: req.user.companyRef } : {};

        const transactions = await Transaction.find(query)
            .populate('plan')
            .populate('company', 'name')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
