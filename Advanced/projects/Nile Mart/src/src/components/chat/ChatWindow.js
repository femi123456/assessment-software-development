"use client";

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useSession } from 'next-auth/react';
import styles from './Chat.module.css';
import MessageInput from './MessageInput';

const ChatWindow = () => {
    const { activeChat, messages, loading, fetchMessages } = useChat();
    const { data: session } = useSession();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeChat?._id) {
            fetchMessages(activeChat._id);
        }
    }, [activeChat, fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!activeChat) {
        return (
            <div className={`${styles.emptyState} ${styles.mobileHidden}`}>
                <i className="ri-message-3-line"></i>
                <h2>Select a chat to start messaging</h2>
                <p>Choose a conversation from the list on the left.</p>
            </div>
        );
    }

    const product = activeChat.product || {};

    return (
        <div className={styles.chatMain}>
            <div className={styles.chatHeaderBar}>
                <button
                    className={styles.backBtn}
                    onClick={() => setActiveChat(null)}
                    aria-label="Back to messages"
                >
                    <i className="ri-arrow-left-s-line"></i>
                </button>
                <div className={styles.headerProductInfo}>
                    {product.image && <img src={product.image} className={styles.headerThumb} alt="" />}
                    <div className={styles.headerText}>
                        <h3>{product.title}</h3>
                        <span className={styles.headerPrice}>${product.price}</span>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn} title="Report User">
                        <i className="ri-flag-line"></i>
                    </button>
                    <button className={styles.iconBtn} title="Block User">
                        <i className="ri-forbid-line"></i>
                    </button>
                </div>
            </div>

            <div className={styles.messagesArea}>
                {loading ? (
                    <div className={styles.loading}>Loading messages...</div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId === session?.user?.id;
                        return (
                            <div
                                key={msg._id}
                                className={`${styles.messageWrapper} ${isMine ? styles.myMessage : styles.theirMessage}`}
                            >
                                <div className={styles.messageBubble}>
                                    {msg.type === 'image' && (
                                        <img src={msg.image} className={styles.imageMsg} alt="Chat image" />
                                    )}
                                    {msg.content && <span>{msg.content}</span>}
                                </div>
                                <span className={styles.messageTime}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMine && (
                                        <span className={styles.readReceipt}>
                                            {/* Logic for read receipts could go here */}
                                            <i className="ri-check-double-line"></i>
                                        </span>
                                    )}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput chatId={activeChat._id} />
        </div>
    );
};

export default ChatWindow;
