const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    googleId: { type: String },
    role: { type: String, enum: ['ADMIN', 'COMPANY', 'USER'], default: 'USER' },
    mobile: { type: String },
    isVerified: {
        email: { type: Boolean, default: false },
        mobile: { type: Boolean, default: false }
    },
    isActive: { type: Boolean, default: true },
    approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
    companyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // If role is COMPANY
    refreshToken: { type: String },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
