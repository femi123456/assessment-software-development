import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    participants: [{
        type: String, // User IDs
        required: true,
    }],
    productId: {
        type: String, // Product ID
        required: true,
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    status: {
        type: String,
        enum: ['active', 'blocked', 'reported'],
        default: 'active',
    },
}, {
    timestamps: true,
});

// To easily find a chat between two users for a specific product
ChatSchema.index({ participants: 1, productId: 1 });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
