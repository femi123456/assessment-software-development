import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: String, // User ID or Email
        required: true,
    },
    type: {
        type: String,
        enum: ['fund', 'withdraw', 'payment', 'receive', 'refund'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'escrow_hold'],
        default: 'pending',
    },
    description: String,
    referenceId: String, // Related Order ID or external ref
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
