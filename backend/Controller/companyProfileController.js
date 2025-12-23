const Company = require('../Models/Schema/Company');
const User = require('../Models/Schema/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role,
        companyRef: user.companyRef,
        name: user.name,
        isVerified: user.isVerified
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.createMyCompany = async (req, res) => {
    try {
        if (req.user.companyRef) {
            return res.status(400).json({ message: 'You already have a company assigned.' });
        }

        const { name, description, contactEmail } = req.body;
        const company = new Company({
            name,
            description,
            contactEmail: contactEmail || req.user.email
        });
        await company.save();

        req.user.companyRef = company._id;
        await req.user.save();

        const token = generateToken(req.user);

        res.status(201).json({ company, user: req.user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyCompany = async (req, res) => {
    try {
        if (!req.user.companyRef) {
            return res.json(null);
        }
        const company = await Company.findById(req.user.companyRef);
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
