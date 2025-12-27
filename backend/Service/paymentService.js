const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (amount, currency = 'INR') => {
    try {
        const options = {
            amount: amount * 100, // Razorpay accepts amount in paise
            currency,
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw error;
    }
};

const verifyPaymentSignature = (orderId, paymentId, signature) => {
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest('hex');

    return generated_signature === signature;
};

module.exports = {
    createOrder,
    verifyPaymentSignature
};
