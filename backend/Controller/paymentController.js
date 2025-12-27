const PaymentService = require('../Service/paymentService');
const Transaction = require('../Models/Schema/Transaction');
const Plan = require('../Models/Schema/Plan');
const Company = require('../Models/Schema/Company');

const createPaymentOrder = async (req, res) => {
    try {
        const { planId, amount, referralCode } = req.body;
        const userId = req.user.id; // From JWT middleware

        // Validate Plan
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Optional: Security check to ensure amount matches plan price (considering referral logic if handled on backend)
        // For now, we trust the amount sent from frontend as per user request to accept 'amount'
        // But strictly, we should recalculate. 
        // Let's create the order with the passed amount.

        const order = await PaymentService.createOrder(amount);

        const newTransaction = new Transaction({
            user: userId,
            plan: planId,
            company: plan.company, // Assuming plan has company reference or we fetch it
            amount: amount,
            paymentMethod: 'RAZORPAY', // Placeholder, specific method known after success
            razorpayOrderId: order.id,
            transactionStatus: 'PENDING',
            referralCode
        });

        await newTransaction.save();

        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID,
            transaction_id: newTransaction._id
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: 'Failed to create payment order', error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const isValid = PaymentService.verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (isValid) {
            transaction.transactionStatus = 'SUCCESS';
            transaction.razorpayPaymentId = razorpay_payment_id;
            await transaction.save();

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                transaction
            });
        } else {
            transaction.transactionStatus = 'FAILURE';
            await transaction.save();
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};

const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .populate('plan')
            .populate('company')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        console.error('History Error:', error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};

const getCompanyTransactions = async (req, res) => {
    try {
        if (!req.user.companyRef) {
            return res.status(400).json({ message: 'No company assigned to this user' });
        }
        const transactions = await Transaction.find({ company: req.user.companyRef })
            .populate('user', 'name email mobile')
            .populate('plan')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        console.error('Company History Error:', error);
        res.status(500).json({ message: 'Failed to fetch company transactions' });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getTransactionHistory,
    getCompanyTransactions
};
