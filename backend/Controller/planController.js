const Plan = require('../Models/Schema/Plan');
const Company = require('../Models/Schema/Company');

exports.createPlan = async (req, res) => {
    try {
        const { price, validity, data, calls, description, companyId } = req.body;
        // Verify company ownership or if admin
        const plan = new Plan({
            company: companyId || req.user.companyRef,
            price,
            validity,
            data,
            calls,
            description
        });
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPlansByCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const plans = await Plan.find({ company: companyId, status: 'ACTIVE' });
        res.json(plans);
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

exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Plan.findByIdAndUpdate(id, req.body, { new: true });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        await Plan.findByIdAndDelete(id);
        res.json({ message: 'Plan deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
