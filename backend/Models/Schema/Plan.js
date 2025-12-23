const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    price: { type: Number, required: true },
    validity: { type: String, required: true }, // e.g., "28 Days"
    data: { type: String, required: true }, // e.g., "1.5GB/Day"
    calls: { type: String, required: true }, // e.g., "Unlimited"
    description: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
