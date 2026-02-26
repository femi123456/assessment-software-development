import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import Product from '@/models/Product';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        const filter = {};
        if (productId) filter.productId = productId;

        const reports = await Report.find(filter)
            .populate('reportedByUserId', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: reports });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { productId, reason, otherReason } = body;

        if (!productId || !reason) {
            return NextResponse.json({ message: "Product ID and Reason are required" }, { status: 400 });
        }

        const report = await Report.create({
            productId,
            reportedByUserId: session.user.id,
            reason,
            otherReason: reason === 'Other' ? otherReason : undefined,
        });

        // Increment reportsCount and check for auto-moderation
        const product = await Product.findById(productId);
        if (product) {
            product.reportsCount = (product.reportsCount || 0) + 1;

            if (product.reportsCount >= 3) {
                product.status = 'pending_review';
            }

            await product.save();
        }

        return NextResponse.json({ success: true, data: report }, { status: 201 });
    } catch (error) {
        console.error('POST /api/reports: Error occurred:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'An error occurred while submitting the report'
        }, { status: 400 });
    }
}
