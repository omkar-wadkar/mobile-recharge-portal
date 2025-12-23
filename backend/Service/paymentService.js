exports.validateCard = (cardNumber, expiry, cvv) => {
    // Basic validation logic
    if (cardNumber.length !== 16) return { valid: false, message: 'Invalid card number length' };
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return { valid: false, message: 'Invalid expiry format (MM/YY)' };
    if (cvv.length !== 3) return { valid: false, message: 'Invalid CVV length' };

    // Specific rules as per requirements
    if (cardNumber === '4111111111111111') {
        return { valid: true, status: 'SUCCESS' };
    } else if (cardNumber === '4000000000000000') {
        return { valid: true, status: 'FAILURE' };
    } else {
        return { valid: false, message: 'Card not recognized by dummy gateway' };
    }
};

exports.validateUPI = (upiId) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(upiId)) return { valid: false, message: 'Invalid UPI ID format' };
    return { valid: true, status: 'SUCCESS' }; // UPI always "success" in this dummy portal unless format is wrong
};
