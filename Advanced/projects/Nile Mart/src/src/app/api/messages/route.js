import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Chat from '@/models/Chat';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
});

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const chatId = searchParams.get('chatId');

        if (!chatId) {
            return NextResponse.json({ message: "Chat ID is required" }, { status: 400 });
        }

        await dbConnect();

        // Verify user is part of the chat
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(session.user.id)) {
            return NextResponse.json({ message: "Unauthorized access to chat" }, { status: 403 });
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

        return NextResponse.json({ success: true, data: messages });
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

        const { chatId, content, type, image } = await request.json();
        const senderId = session.user.id;

        await dbConnect();

        // Verify user is part of the chat
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(senderId)) {
            return NextResponse.json({ message: "Unauthorized to send messages in this chat" }, { status: 403 });
        }

        const message = await Message.create({
            chatId,
            senderId,
            content,
            type: type || 'text',
            image
        });

        // Update last message in Chat
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message._id,
        });

        // Trigger Pusher event for the specific chat
        await pusher.trigger(`chat-${chatId}`, 'message', message);

        // Also trigger an update for the other participant's chat list
        const otherParticipant = chat.participants.find(id => id !== senderId);
        if (otherParticipant) {
            const updatedChat = await Chat.findById(chatId).populate('lastMessage').lean();
            const product = await Product.findById(chat.productId).select('title price image').lean();
            await pusher.trigger(`user-${otherParticipant}`, 'update-chat', { ...updatedChat, product });
        }

        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
