"use client";

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { useSession } from 'next-auth/react';
import styles from './Chat.module.css';

const ChatList = () => {
    const { chats, activeChat, setActiveChat } = useChat();
    const { data: session } = useSession();

    if (!chats || chats.length === 0) {
        return (
            <div className={`${styles.emptyList} ${activeChat ? styles.sidebarHidden : ''}`}>
                <i className="ri-chat-history-line"></i>
                <p>No conversations yet</p>
            </div>
        );
    }

    return (
        <div className={`${styles.chatList} ${activeChat ? styles.sidebarHidden : ''}`}>
            <h2 className={styles.listTitle}>Messages</h2>
            <div className={styles.listItems}>
                {chats.map((chat) => {
                    const isActive = activeChat?._id === chat._id;
                    const product = chat.product || {};

                    return (
                        <div
                            key={chat._id}
                            className={`${styles.chatItem} ${isActive ? styles.activeItem : ''}`}
                            onClick={() => setActiveChat(chat)}
                        >
                            <div className={styles.productImageThumb}>
                                {product.image ? (
                                    <img src={product.image} alt={product.title} />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <i className="ri-image-line"></i>
                                    </div>
                                )}
                            </div>
                            <div className={styles.chatInfo}>
                                <div className={styles.chatHeader}>
                                    <span className={styles.productTitle}>{product.title || 'Unknown Product'}</span>
                                    <span className={styles.chatTime}>
                                        {new Date(chat.updatedAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className={styles.lastMessage}>
                                    {chat.lastMessage?.content || 'Started a conversation'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChatList;
