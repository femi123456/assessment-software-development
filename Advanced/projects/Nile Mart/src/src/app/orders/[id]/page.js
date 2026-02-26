"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './Order.module.css';

export default function OrderPage({ params }) {
    const { data: session } = useSession();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);

    const fetchOrder = async () => {
        try {
            const { id } = await params;
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (data.success) setOrder(data.data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const handleConfirmReceipt = async () => {
        if (!confirm("Are you sure you have received the item? This will release the funds to the seller.")) return;

        setConfirming(true);
        try {
            const res = await fetch(`/api/orders/${order._id}/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'confirm_receipt' })
            });
            const data = await res.json();
            if (data.success) {
                fetchOrder();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Confirmation error:', error);
        } finally {
            setConfirming(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '80px 0' }}>Loading order...</div>;
    if (!order) return <div className="container" style={{ padding: '80px 0' }}>Order not found</div>;

    const statuses = [
        { id: 'escrow_hold', label: 'Escrow Hold', icon: 'ri-shield-keyhole-line' },
        { id: 'accepted', label: 'Accepted', icon: 'ri-check-line' },
        { id: 'on_the_way', label: 'On the Way', icon: 'ri-truck-line' },
        { id: 'delivered', label: 'Delivered', icon: 'ri-home-heart-line' },
        { id: 'completed', label: 'Completed', icon: 'ri-service-line' }
    ];

    const currentStatusIndex = statuses.findIndex(s => s.id === order.status);

    return (
        <div className={`container ${styles.page}`}>
            <header className={styles.header}>
                <div>
                    <span className={styles.orderLabel}>Order #{order._id.toString().slice(-6)}</span>
                    <h1 className={styles.title}>Track your delivery</h1>
                </div>
                <div className={`${styles.badge} ${styles[order.status]}`}>
                    {order.status.replace('_', ' ')}
                </div>
            </header>

            <div className={styles.layout}>
                <div className={styles.main}>
                    <div className={styles.progressSection}>
                        <div className={styles.progressSteps}>
                            {statuses.map((s, index) => (
                                <div key={s.id} className={`${styles.step} ${index <= currentStatusIndex ? styles.activeStep : ''}`}>
                                    <div className={styles.stepIcon}>
                                        <i className={s.icon}></i>
                                    </div>
                                    <span className={styles.stepLabel}>{s.label}</span>
                                    {index < statuses.length - 1 && <div className={styles.stepLine}></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.detailsRow}>
                        <div className={styles.detailCard}>
                            <h3>Delivery Details</h3>
                            <div className={styles.info}>
                                <i className="ri-map-pin-line"></i>
                                <div>
                                    <strong>{order.deliveryMethod === 'meetup' ? 'Meet-up Spot' : 'Courier Delivery'}</strong>
                                    <p>{order.deliveryMethod === 'meetup' ? order.deliveryDetails.meetupSpot : `${order.deliveryDetails.address}, ${order.deliveryDetails.city}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.detailCard}>
                            <h3>Seller</h3>
                            <div className={styles.info}>
                                <i className="ri-user-smile-line"></i>
                                <div>
                                    <strong>Verified Student</strong>
                                    <p>Safe campus trading active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.orderSummary}>
                        <h3>Order Summary</h3>
                        {order.items.map((item, idx) => (
                            <div key={idx} className={styles.productItem}>
                                <img src={item.image} alt="" />
                                <div>
                                    <strong>{item.title}</strong>
                                    <span>₦{item.price.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                        <div className={styles.totalBlock}>
                            <div className={styles.row}>
                                <span>Total</span>
                                <strong>₦{order.total.toLocaleString()}</strong>
                            </div>
                        </div>

                        {order.status !== 'completed' && order.buyerId === session?.user?.id && (
                            <div className={styles.actions}>
                                <button
                                    className={styles.confirmBtn}
                                    onClick={handleConfirmReceipt}
                                    disabled={confirming}
                                >
                                    {confirming ? 'Releasing Funds...' : 'I have received this item'}
                                </button>
                                <p className={styles.actionNote}>Only click this when the item is in your hands.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
