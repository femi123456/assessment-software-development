import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
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

        // Find chats where the user is a participant
        // We fetch the chat details and link the product info
        const userChats = await Chat.find({
            participants: session.user.id
        }).sort({ updatedAt: -1 }).lean();

        // Populate basic product info manually or via .populate if set up
        const chatsWithDetails = await Promise.all(userChats.map(async (chat) => {
            const product = await Product.findById(chat.productId).select('title price image').lean();
            return {
                ...chat,
                product
            };
        }));

        return NextResponse.json({ success: true, data: chatsWithDetails });
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

        const { productId, sellerId } = await request.json();
        const buyerId = session.user.id;

        if (buyerId === sellerId) {
            return NextResponse.json({ message: "You cannot chat with yourself" }, { status: 400 });
        }

        await dbConnect();

        // Check if chat already exists for this specific product and these two users
        let chat = await Chat.findOne({
            productId,
            participants: { $all: [buyerId, sellerId] }
        });

        if (!chat) {
            chat = await Chat.create({
                productId,
                participants: [buyerId, sellerId],
                status: 'active'
            });
        }

        return NextResponse.json({ success: true, data: chat });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
