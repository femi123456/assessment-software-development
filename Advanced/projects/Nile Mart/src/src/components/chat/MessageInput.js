"use client";

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import styles from './Chat.module.css';

const MessageInput = ({ chatId }) => {
    const [message, setMessage] = useState('');
    const { sendMessage } = useChat();

    const quickReplies = [
        "Is this still available?",
        "What's your last price?",
        "Where can we meet?",
        "Is it in good condition?"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const content = message;
        setMessage(''); // Clear input optimistically
        await sendMessage(chatId, content);
    };

    const handleQuickReply = (reply) => {
        sendMessage(chatId, reply);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                sendMessage(chatId, "Sent an image", 'image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.inputArea}>
            <div className={styles.quickReplies}>
                {quickReplies.map((reply, index) => (
                    <button
                        key={index}
                        className={styles.quickBtn}
                        onClick={() => handleQuickReply(reply)}
                    >
                        {reply}
                    </button>
                ))}
            </div>
            <form className={styles.inputWrapper} onSubmit={handleSubmit}>
                <label className={styles.iconBtn}>
                    <i className="ri-image-add-line"></i>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                    />
                </label>
                <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className={`${styles.iconBtn} ${styles.sendBtn}`}>
                    <i className="ri-send-plane-2-fill"></i>
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
