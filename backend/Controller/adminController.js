const User = require('../Models/Schema/User');
const Company = require('../Models/Schema/Company');
const Plan = require('../Models/Schema/Plan');
const Transaction = require('../Models/Schema/Transaction');

exports.getStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments({ role: 'USER' });
        const companiesCount = await Company.countDocuments();
        const plansCount = await Plan.countDocuments();
        const transactionsCount = await Transaction.countDocuments();
        const totalRevenue = await Transaction.aggregate([
            { $match: { transactionStatus: 'SUCCESS' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            users: usersCount,
            companies: companiesCount,
            plans: plansCount,
            transactions: transactionsCount,
            revenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'ADMIN' } }).populate('companyRef');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = !user.isActive;
        await user.save();
        res.json({ message: `User ${user.isActive ? 'enabled' : 'disabled'}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        company.isActive = !company.isActive;
        company.status = company.isActive ? 'ACTIVE' : 'INACTIVE';
        await company.save();
        res.json({ message: `Company ${company.isActive ? 'enabled' : 'disabled'}`, company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        // Optional: Delete associated plans and users?
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, mobile } = req.body;
        const user = new User({ name, email, password, role, mobile });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find().populate('company');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user plan company').sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPendingProviders = async (req, res) => {
    try {
        const providers = await User.find({ role: 'COMPANY', approvalStatus: 'PENDING' });
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProviderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED or REJECTED

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (status === 'REJECTED') {
            await User.findByIdAndDelete(id);
            return res.json({ message: 'Provider rejected and removed from system.' });
        }

        user.approvalStatus = status;
        await user.save();

        // Optional: Send email notification

        res.json({ message: `Provider ${status.toLowerCase()} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
