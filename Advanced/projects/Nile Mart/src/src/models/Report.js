import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    reportedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
        type: String,
        required: true,
        enum: ['Scam / Fake item', 'Inappropriate content', 'Wrong category', 'Harassment', 'Other'],
    },
    otherReason: {
        type: String,
        required: function () {
            return this.reason === 'Other';
        },
    },
}, {
    timestamps: true,
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
