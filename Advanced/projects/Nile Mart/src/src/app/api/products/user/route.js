import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await dbConnect();
        const products = await Product.find({ sellerEmail: session.user.email }).sort({ createdAt: -1 });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Fetch user products error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
