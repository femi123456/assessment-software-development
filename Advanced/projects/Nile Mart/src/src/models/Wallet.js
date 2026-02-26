import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    userId: {
        type: String, // User ID or Email
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,
    },
    currency: {
        type: String,
        default: 'NGN',
    },
}, {
    timestamps: true,
});

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
