require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./Models/Schema/User');

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'omkar.a.wadkar2@gmail.com' });

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('User CompanyRef (Raw):', user.companyRef);

        const tokenPayload = {
            id: user._id,
            role: user.role,
            companyRef: user.companyRef,
            name: user.name,
            isVerified: user.isVerified
        };
        console.log('Payload to Sign:', tokenPayload);

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Token Generated.');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        if (decoded.companyRef) {
            console.log('SUCCESS: companyRef is present in token.');
        } else {
            console.log('FAILURE: companyRef is MISSING in token.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

test();
