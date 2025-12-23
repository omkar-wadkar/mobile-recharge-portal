require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/Schema/User');
const Company = require('./Models/Schema/Company');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- USERS ---');
        const users = await User.find({});
        users.forEach(u => {
            console.log(`User: ${u.email} | Role: ${u.role} | CompanyRef: ${u.companyRef}`);
        });

        console.log('\n--- COMPANIES ---');
        const companies = await Company.find({});
        companies.forEach(c => {
            console.log(`Company: ${c.name} | ID: ${c._id}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
