import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: String
    }],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'escrow_hold', 'on_the_way', 'delivered', 'completed', 'cancelled', 'disputed'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'escrow_hold', 'released', 'refunded'],
        default: 'pending',
    },
    deliveryMethod: {
        type: String,
        enum: ['meetup', 'courier'],
        default: 'meetup',
    },
    buyerId: {
        type: String, // Email or User ID
        required: true,
    },
    sellerId: {
        type: String,
        required: true,
    },
    deliveryDetails: {
        meetupSpot: String,
        address: String,
        city: String,
        zipCode: String,
        estimatedTime: String,
        deliveryFee: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
