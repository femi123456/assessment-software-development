import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    senderId: {
        type: String, // User ID
        required: true,
    },
    content: {
        type: String,
        required: function () { return this.type === 'text' || this.type === 'system'; },
    },
    image: {
        type: String,
        required: function () { return this.type === 'image'; },
    },
    type: {
        type: String,
        enum: ['text', 'image', 'system'],
        default: 'text',
    },
    readBy: [{
        type: String, // User IDs
    }],
    deliveredTo: [{
        type: String, // User IDs
    }],
}, {
    timestamps: true,
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
