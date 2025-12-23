require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/Schema/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const existingAdmin = await User.findOne({ email: 'admin@portal.com' });
        if (existingAdmin) {
            console.log('Admin already exists.');
            // Ensure role is correct
            if (existingAdmin.role !== 'ADMIN') {
                existingAdmin.role = 'ADMIN';
                await existingAdmin.save();
                console.log('Updated existing user to ADMIN role');
            }
        } else {
            const admin = new User({
                name: 'System Admin',
                email: 'admin@portal.com',
                password: 'admin123',
                role: 'ADMIN',
                isVerified: { email: true, mobile: true }
            });
            // Password hashing is handled by pre('save') but we need to ensure it triggers or do it manually if we bypass?
            // User.js pre('save') should handle it.

            await admin.save();
            console.log('Admin created: admin@portal.com / admin123');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
