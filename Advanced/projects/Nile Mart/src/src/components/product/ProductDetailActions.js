"use client";

import styles from '@/app/shop/[id]/page.module.css';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useChat } from '@/context/ChatContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReportModal from './ReportModal';

export default function ProductDetailActions({ product }) {
    const { addToCart } = useCart();
    const { setActiveChat } = useChat();
    const [added, setAdded] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleChat = async () => {
        if (!session) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product._id,
                    sellerId: product.sellerId || product.sellerEmail
                })
            });
            const data = await res.json();
            if (data.success) {
                setActiveChat(data.data);
                router.push('/messages');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    return (
        <div className={styles.actions}>
            <Button
                className={styles.addToCart}
                variant="primary"
                onClick={handleAdd}
            >
                {added ? "Added to Bag" : "Add to Cart"}
            </Button>
            <Button variant="secondary" onClick={handleChat}>Contact Seller</Button>
            <Button
                variant="outline"
                onClick={() => setShowReportModal(true)}
                style={{ color: '#df2020', borderColor: '#df2020' }}
            >
                🚩 Report
            </Button>
            {showReportModal && (
                <ReportModal
                    productId={product._id}
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </div>
    );
}
