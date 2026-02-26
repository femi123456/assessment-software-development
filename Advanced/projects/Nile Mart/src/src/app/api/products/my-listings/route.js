import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Use sellerId if available, fallback to email if that's how products are stored
        const listings = await Product.find({
            $or: [
                { sellerId: session.user.id },
                { sellerEmail: session.user.email }
            ]
        }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: listings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
