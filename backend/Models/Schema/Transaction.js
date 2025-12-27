const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['CARD', 'UPI', 'RAZORPAY'], required: true },
    transactionStatus: { type: String, enum: ['SUCCESS', 'FAILURE', 'PENDING'], default: 'PENDING' },
    paymentDetails: {
        last4: { type: String },
        upiId: { type: String }
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    referralCode: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
