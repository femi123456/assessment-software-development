import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { action } = await request.json(); // 'confirm_receipt' or 'cancel'

        await dbConnect();

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        if (action === 'confirm_receipt') {
            if (order.buyerId !== session.user.id) {
                return NextResponse.json({ message: "Only the buyer can confirm receipt" }, { status: 403 });
            }

            if (order.status !== 'escrow_hold' && order.status !== 'on_the_way' && order.status !== 'delivered') {
                return NextResponse.json({ message: "Order is not in a confirmable state" }, { status: 400 });
            }

            // RELEASE FUNDS TO SELLER
            const sellerWallet = await Wallet.findOne({ userId: order.sellerId });
            if (!sellerWallet) {
                // If seller has no wallet, create it
                await Wallet.create({ userId: order.sellerId, balance: order.total });
            } else {
                sellerWallet.balance += order.total;
                await sellerWallet.save();
            }

            // Log transaction for seller
            await Transaction.create({
                userId: order.sellerId,
                type: 'receive',
                amount: order.total,
                status: 'completed',
                description: `Payment received for Order #${order._id.toString().slice(-6)}`,
                referenceId: order._id
            });

            // Update order status
            order.status = 'completed';
            order.paymentStatus = 'released';
            await order.save();

            return NextResponse.json({ success: true, message: "Funds released to seller. Order completed." });
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
