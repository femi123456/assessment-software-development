"use client";

import React from 'react';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import styles from '@/components/chat/Chat.module.css';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function MessagesPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <div className="container" style={{ padding: '40px' }}>Loading...</div>;

    if (status === 'unauthenticated') {
        redirect('/login');
    }

    return (
        <div className={styles.chatContainer}>
            <aside className={styles.chatSidebar}>
                <ChatList />
            </aside>
            <main className={styles.chatMain}>
                <ChatWindow />
            </main>
        </div>
    );
}
