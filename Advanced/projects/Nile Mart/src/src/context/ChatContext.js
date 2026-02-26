"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { data: session } = useSession();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    // Fetch user chats
    const fetchChats = useCallback(async () => {
        if (!session?.user) return;
        try {
            const res = await fetch('/api/chats');
            const data = await res.json();
            if (data.success) {
                setChats(data.data);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    }, [session]);

    // Fetch messages for active chat
    const fetchMessages = useCallback(async (chatId) => {
        if (!chatId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/messages?chatId=${chatId}`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Send a message
    const sendMessage = async (chatId, content, type = 'text', image = null) => {
        if (!chatId || (!content && !image)) return;
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, content, type, image }),
            });
            const data = await res.json();
            if (data.success) {
                // Optimistic update handled by Pusher usually, 
                // but we can also manually add it if needed
                // setMessages(prev => [...prev, data.data]);
                return data.data;
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Initialize Pusher
    useEffect(() => {
        if (!session?.user?.id) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'YOUR_KEY', {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
            authEndpoint: '/api/pusher/auth',
        });

        // Global channel for chat list updates (new chats, last message updates)
        const userChannel = pusher.subscribe(`user-${session.user.id}`);
        userChannel.bind('new-chat', (newChat) => {
            setChats(prev => [newChat, ...prev]);
        });

        userChannel.bind('update-chat', (updatedChat) => {
            setChats(prev => prev.map(c => c._id === updatedChat._id ? updatedChat : c));
        });

        return () => {
            pusher.unsubscribe(`user-${session.user.id}`);
            if (activeChat) pusher.unsubscribe(`chat-${activeChat._id}`);
        };
    }, [session]);

    // Subscribe to active chat messages
    useEffect(() => {
        if (!activeChat || !session?.user?.id) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'YOUR_KEY', {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
        });

        const chatChannel = pusher.subscribe(`chat-${activeChat._id}`);
        chatChannel.bind('message', (newMessage) => {
            if (newMessage.senderId !== session.user.id) {
                setMessages(prev => [...prev, newMessage]);
            }
        });

        return () => {
            pusher.unsubscribe(`chat-${activeChat._id}`);
        };
    }, [activeChat, session]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    return (
        <ChatContext.Provider value={{
            chats,
            activeChat,
            setActiveChat,
            messages,
            setMessages,
            loading,
            fetchMessages,
            sendMessage,
            onlineUsers,
            refreshChats: fetchChats
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
