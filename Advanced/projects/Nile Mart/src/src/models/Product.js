import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a product title'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price cannot be negative'],
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
    },
    image: {
        type: String,
        required: false,
    },
    seller: {
        type: String,
        required: true,
    },
    sellerEmail: {
        type: String,
        required: true,
    },
    sellerId: String,
    status: {
        type: String,
        enum: ['approved', 'pending_review', 'deleted', 'sold', 'active', 'pending'],
        default: 'approved',
    },
    reportsCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
