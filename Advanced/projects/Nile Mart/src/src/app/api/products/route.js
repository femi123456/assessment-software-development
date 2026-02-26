import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get('sellerId');
        const category = searchParams.get('category');
        const q = searchParams.get('q');

        // Build filter
        const filter = {};
        if (sellerId) {
            filter.sellerId = sellerId;
        } else {
            // Only show approved or active products to regular users in the main shop
            filter.status = { $in: ['approved', 'active'] };
        }

        if (category) filter.category = category;
        if (q) filter.title = { $regex: q, $options: 'i' };

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log("POST /api/products: Unauthorized - No session found");
            return NextResponse.json({ message: "Unauthorized - Please sign in again" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        console.log("POST /api/products: Creating product with data:", {
            ...body,
            seller: session.user.name,
            sellerEmail: session.user.email,
            sellerId: session.user.id,
        });

        const product = await Product.create({
            ...body,
            seller: session.user.name,
            sellerEmail: session.user.email,
            sellerId: session.user.id || session.user.email || 'system',
        });

        console.log("POST /api/products: Successfully created product:", product._id);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        console.error('POST /api/products: Error occurred:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'An error occurred while creating the product'
        }, { status: 400 });
    }
}
