"use client";

import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';
import { SessionProvider } from 'next-auth/react';
import { WalletProvider } from "@/context/WalletContext";

export default function Providers({ children }) {
    return (
        <SessionProvider>
            <WalletProvider>
                <ChatProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </ChatProvider>
            </WalletProvider>
        </SessionProvider>
    );
}
