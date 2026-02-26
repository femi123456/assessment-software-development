import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Basic validation could go here

        const order = await Order.create({
            items: body.items,
            total: body.total,
            buyerId: body.buyerId,
            shippingAddress: body.shippingAddress
        });

        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
