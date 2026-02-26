"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './Checkout.module.css';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [deliveryMethod, setDeliveryMethod] = useState('meetup');
    const [deliveryDetails, setDeliveryDetails] = useState({
        meetupSpot: '',
        address: '',
        city: '',
        zipCode: ''
    });

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');

        const fetchWallet = async () => {
            const res = await fetch('/api/wallet');
            const data = await res.json();
            if (data.success) setWalletBalance(data.data.balance);
        };

        if (session) fetchWallet();
    }, [status, session, router]);

    const handleDetailsChange = (e) => {
        setDeliveryDetails({ ...deliveryDetails, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (walletBalance < cartTotal) {
            alert('Insufficient balance. Please fund your wallet in your profile.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        productId: item._id,
                        title: item.title,
                        price: item.price,
                        quantity: 1,
                        image: item.image
                    })),
                    total: cartTotal + (deliveryMethod === 'courier' ? 500 : 0),
                    deliveryMethod,
                    deliveryDetails
                })
            });

            const data = await res.json();
            if (data.success) {
                clearCart();
                router.push(`/orders/${data.data._id}`);
            } else {
                alert(data.message || 'Checkout failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <button onClick={() => router.push('/shop')} className="btn btn-primary">Go Shopping</button>
            </div>
        );
    }

    return (
        <div className={`container ${styles.page}`}>
            <h1 className={styles.title}>Secure Checkout</h1>

            <div className={styles.layout}>
                <div className={styles.main}>
                    <section className={styles.section}>
                        <h3>1. Delivery Method</h3>
                        <div className={styles.options}>
                            <label className={`${styles.option} ${deliveryMethod === 'meetup' ? styles.active : ''}`}>
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="meetup"
                                    checked={deliveryMethod === 'meetup'}
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                />
                                <div className={styles.optionInfo}>
                                    <i className="ri-user-location-line"></i>
                                    <div>
                                        <strong>Campus Meet-up</strong>
                                        <p>Meet seller at a safe spot on campus</p>
                                    </div>
                                    <span className={styles.fee}>Free</span>
                                </div>
                            </label>

                            <label className={`${styles.option} ${deliveryMethod === 'courier' ? styles.active : ''}`}>
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="courier"
                                    checked={deliveryMethod === 'courier'}
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                />
                                <div className={styles.optionInfo}>
                                    <i className="ri-truck-line"></i>
                                    <div>
                                        <strong>Student Courier</strong>
                                        <p>Delivered to your hostel/address</p>
                                    </div>
                                    <span className={styles.fee}>₦500</span>
                                </div>
                            </label>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3>2. Delivery Details</h3>
                        {deliveryMethod === 'meetup' ? (
                            <div className={styles.inputGroup}>
                                <label>Proposed Meet-up Spot</label>
                                <input
                                    type="text"
                                    name="meetupSpot"
                                    placeholder="e.g. Faculty of Arts Entrance"
                                    className={styles.input}
                                    value={deliveryDetails.meetupSpot}
                                    onChange={handleDetailsChange}
                                    required
                                />
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>Hostel/Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Hall 2, Room 405"
                                        className={styles.input}
                                        value={deliveryDetails.address}
                                        onChange={handleDetailsChange}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>City/Campus Area</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="Main Campus"
                                        className={styles.input}
                                        value={deliveryDetails.city}
                                        onChange={handleDetailsChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.summaryCard}>
                        <h3>Order Summary</h3>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Delivery</span>
                            <span>{deliveryMethod === 'meetup' ? 'Free' : '₦500'}</span>
                        </div>
                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <span>Total</span>
                            <span>₦{(cartTotal + (deliveryMethod === 'courier' ? 500 : 0)).toLocaleString()}</span>
                        </div>

                        <div className={styles.paymentInfo}>
                            <div className={styles.walletStatus}>
                                <span>Wallet Balance:</span>
                                <strong className={walletBalance < cartTotal ? styles.lowBalance : ''}>
                                    ₦{walletBalance.toLocaleString()}
                                </strong>
                            </div>
                            {walletBalance < cartTotal && (
                                <p className={styles.warning}>Insufficient balance. Go to Profile to fund wallet.</p>
                            )}
                        </div>

                        <button
                            className={styles.payBtn}
                            onClick={handleCheckout}
                            disabled={loading || walletBalance < cartTotal}
                        >
                            {loading ? 'Processing...' : `Pay ₦${(cartTotal + (deliveryMethod === 'courier' ? 500 : 0)).toLocaleString()}`}
                        </button>

                        <div className={styles.escrowNotice}>
                            <i className="ri-shield-check-fill"></i>
                            <p>Your payment will be held in escrow until you confirm receiving the item.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
