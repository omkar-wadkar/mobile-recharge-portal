const mongoose = require('mongoose');
const User = require('./backend/Models/Schema/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

async function testAuth() {
    try {
        console.log('Connecting to DB...');
        // Mock DB connection if env not available, but let's try to load it
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            // Try default local
            await mongoose.connect('mongodb://localhost:27017/mobile-recharge');
        } else {
            await mongoose.connect(process.env.MONGO_URI);
        }
        console.log('Connected.');

        const email = 'testuser_' + Date.now() + '@example.com';
        const password = 'password123';

        console.log('Creating user:', email);
        const user = new User({
            name: 'Test User',
            email,
            password,
            role: 'USER',
            mobile: '1234567890'
        });

        await user.save();
        console.log('User saved.');

        const savedUser = await User.findOne({ email });
        console.log('User retrieved.');
        console.log('Password hash length:', savedUser.password.length);
        console.log('Is password hashed?', savedUser.password !== password);

        const isMatch = await bcrypt.compare(password, savedUser.password);
        console.log('Password match result:', isMatch);

        if (isMatch) {
            console.log('SUCCESS: Authentication logic works.');
        } else {
            console.error('FAILURE: Password mismatch.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testAuth();
