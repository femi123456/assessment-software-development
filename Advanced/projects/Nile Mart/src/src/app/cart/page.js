"use client";

import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!cart || cart.length === 0) {
        return (
            <div className={`container ${styles.emptyContainer}`}>
                <div className={styles.emptyContent}>
                    <i className="ri-shopping-bag-line"></i>
                    <h1>Your bag is empty.</h1>
                    <p>Check out our latest products and start shopping.</p>
                    <Link href="/shop" className="btn btn-primary">Go to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.page}`}>
            <h1 className={styles.pageTitle}>Shopping Bag</h1>

            <div className={styles.layout}>
                <div className={styles.itemsList}>
                    {cart.map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                            <div className={styles.itemImage}>
                                <Image
                                    src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                                    alt={item.title}
                                    fill
                                    className={styles.image}
                                />
                            </div>

                            <div className={styles.itemInfo}>
                                <div className={styles.itemHeader}>
                                    <Link href={`/shop/${item.id}`} className={styles.itemTitle}>{item.title}</Link>
                                    <p className={styles.itemPrice}>₦{(item.price * item.quantity).toLocaleString()}</p>
                                </div>

                                <p className={styles.itemCategory}>{item.category}</p>

                                <div className={styles.itemActions}>
                                    <div className={styles.quantity}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <h2>Summary</h2>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Estimated Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`}>
                            Check Out
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
