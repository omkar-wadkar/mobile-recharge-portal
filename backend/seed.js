require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/Schema/User');
const Company = require('./Models/Schema/Company');
const Plan = require('./Models/Schema/Plan');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Company.deleteMany({});
        await Plan.deleteMany({});

        // Create Admin
        const admin = new User({
            name: 'System Admin',
            email: 'admin@portal.com',
            password: 'admin123',
            role: 'ADMIN',
            isVerified: { email: true, mobile: true }
        });
        await admin.save();
        console.log('Admin created: admin@portal.com / admin123');

        // Create Companies
        const airtel = new Company({ name: 'Airtel', contactEmail: 'support@airtel.com', description: 'Faster network' });
        const jio = new Company({ name: 'Jio', contactEmail: 'support@jio.com', description: 'Digital life' });
        await airtel.save();
        await jio.save();
        console.log('Companies created');

        // Create Company User (Airtel)
        const airtelUser = new User({
            name: 'Airtel Manager',
            email: 'manager@airtel.com',
            password: 'password123',
            role: 'COMPANY',
            companyRef: airtel._id,
            isVerified: { email: true, mobile: true }
        });
        await airtelUser.save();
        console.log('Company User created: manager@airtel.com / password123');

        // Create Plans
        const plans = [
            { company: airtel._id, price: 299, validity: '28 Days', data: '1.5GB/Day', calls: 'Unlimited', description: 'Best seller' },
            { company: airtel._id, price: 599, validity: '84 Days', data: '2GB/Day', calls: 'Unlimited', description: 'Quarterly pack' },
            { company: jio._id, price: 249, validity: '28 Days', data: '2GB/Day', calls: 'Unlimited', description: 'Value for money' },
            { company: jio._id, price: 749, validity: '90 Days', data: '2GB/Day', calls: 'Unlimited', description: 'Long term' }
        ];
        await Plan.insertMany(plans);
        console.log('Plans created');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
