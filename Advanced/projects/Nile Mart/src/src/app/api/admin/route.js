import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized - Admin only" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { action, targetId, targetType } = body;

        if (!action || !targetId || !targetType) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (targetType === 'product') {
            const product = await Product.findById(targetId);
            if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

            if (action === 'approve') {
                product.status = 'approved';
                product.reportsCount = 0; // Reset reports on manual approval
            } else if (action === 'delete') {
                product.status = 'deleted';

                // Increment seller's strikeCount when an item is deleted
                const seller = await User.findById(product.sellerId);
                if (seller) {
                    seller.strikeCount = (seller.strikeCount || 0) + 1;
                    await seller.save();
                }
            }
            await product.save();
        } else if (targetType === 'user') {
            const user = await User.findById(targetId);
            if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

            if (action === 'warn') {
                // In a real app, this might send an email or notification
                console.log(`Warning issued to user ${user.email}`);
            } else if (action === 'block') {
                user.canPost = false;
            } else if (action === 'unblock') {
                user.canPost = true;
            } else if (action === 'resetStrikes') {
                user.strikeCount = 0;
            }
            await user.save();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('POST /api/admin: Error occurred:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'An error occurred'
        }, { status: 400 });
    }
}
