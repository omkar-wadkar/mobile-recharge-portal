const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    contactEmail: { type: String },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
