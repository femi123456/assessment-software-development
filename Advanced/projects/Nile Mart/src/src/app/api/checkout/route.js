import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { items, total, deliveryMethod, deliveryDetails } = await request.json();
        const buyerId = session.user.id;

        await dbConnect();

        // 1. Check buyer's wallet balance
        const wallet = await Wallet.findOne({ userId: buyerId });
        if (!wallet || wallet.balance < total) {
            return NextResponse.json({ message: "Insufficient wallet balance. Please fund your wallet." }, { status: 400 });
        }

        // 2. Identify the seller (assuming single seller per order for simplicity)
        const firstItem = await Product.findById(items[0].productId);
        const sellerId = firstItem.sellerId;

        if (buyerId === sellerId) {
            return NextResponse.json({ message: "You cannot buy your own items." }, { status: 400 });
        }

        // 3. Create Order in 'escrow_hold' state
        const order = await Order.create({
            items,
            total,
            buyerId,
            sellerId,
            deliveryMethod,
            deliveryDetails,
            status: 'escrow_hold',
            paymentStatus: 'escrow_hold'
        });

        // 4. Debit buyer's wallet
        wallet.balance -= total;
        await wallet.save();

        // 5. Create Transaction record for buyer
        await Transaction.create({
            userId: buyerId,
            type: 'payment',
            amount: total,
            status: 'escrow_hold',
            description: `Payment for Order #${order._id.toString().slice(-6)}`,
            referenceId: order._id
        });

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
