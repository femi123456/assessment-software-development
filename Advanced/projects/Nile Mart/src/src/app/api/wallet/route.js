import dbConnect from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
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

        let wallet = await Wallet.findOne({ userId: session.user.id });

        // Auto-create wallet if it doesn't exist
        if (!wallet) {
            wallet = await Wallet.create({
                userId: session.user.id,
                balance: 0
            });
        }

        const transactions = await Transaction.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json({
            success: true,
            data: {
                balance: wallet.balance,
                transactions
            }
        });
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

        const { amount, type, description } = await request.json();
        const userId = session.user.id;

        await dbConnect();

        let wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            wallet = await Wallet.create({ userId, balance: 0 });
        }

        if (type === 'fund') {
            wallet.balance += parseFloat(amount);
            await wallet.save();

            await Transaction.create({
                userId,
                type: 'fund',
                amount: parseFloat(amount),
                status: 'completed',
                description: description || 'Wallet Funding'
            });
        } else if (type === 'withdraw') {
            if (wallet.balance < amount) {
                return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
            }
            wallet.balance -= parseFloat(amount);
            await wallet.save();

            await Transaction.create({
                userId,
                type: 'withdraw',
                amount: parseFloat(amount),
                status: 'completed',
                description: description || 'Wallet Withdrawal'
            });
        }

        return NextResponse.json({ success: true, balance: wallet.balance });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
