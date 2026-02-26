"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import styles from './page.module.css';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('wallet');
    const [orders, setOrders] = useState([]);
    const [listings, setListings] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const fetchData = async (tab) => {
        setLoadingData(true);
        try {
            if (tab === 'orders') {
                const res = await fetch('/api/orders/my-orders');
                const data = await res.json();
                if (data.success) setOrders(data.data);
            } else if (tab === 'listings') {
                const res = await fetch('/api/products/my-listings');
                const data = await res.json();
                if (data.success) setListings(data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleDeleteListing = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                // Refresh listings
                fetchData('listings');
            } else {
                alert(data.message || 'Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        if (activeTab === 'orders' || activeTab === 'listings') {
            fetchData(activeTab);
        }
    }, [activeTab]);

    if (status === 'loading') return <div className="container" style={{ padding: '80px 0' }}>Loading...</div>;

    if (status === 'unauthenticated') {
        redirect('/login');
    }

    const tabs = [
        { id: 'wallet', name: 'Wallet', icon: 'ri-wallet-line' },
        { id: 'orders', name: 'My Orders', icon: 'ri-shopping-bag-line' },
        { id: 'listings', name: 'My Listings', icon: 'ri-list-check' },
        { id: 'settings', name: 'Settings', icon: 'ri-settings-3-line' },
    ];

    return (
        <div className={`container ${styles.page}`}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h1>{session?.user?.name}</h1>
                        <p>{session?.user?.email}</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/sell" className="btn btn-primary" style={{ marginRight: '16px' }}>
                        <i className="ri-add-line"></i> List New Item
                    </Link>
                    <button
                        className={styles.logoutBtn}
                        onClick={() => signOut({ callbackUrl: '/' })}
                    >
                        <i className="ri-logout-box-r-line"></i> <span>Sign Out</span>
                    </button>
                </div>
            </header>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={tab.icon}></i>
                            {tab.name}
                        </button>
                    ))}
                </aside>

                <main className={styles.content}>
                    {activeTab === 'wallet' && <WalletDashboard />}

                    {activeTab === 'orders' && (
                        <div className={styles.listContainer}>
                            <h2 className={styles.sectionTitle}>My Orders</h2>
                            {loadingData ? <p>Loading orders...</p> :
                                orders.length > 0 ? (
                                    <div className={styles.list}>
                                        {orders.map(order => (
                                            <Link href={`/orders/${order._id}`} key={order._id} className={styles.listItem}>
                                                <div className={styles.itemInfo}>
                                                    <strong>Order #{order._id.toString().slice(-6)}</strong>
                                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className={styles.itemStatus}>
                                                    <span className={`${styles.badge} ${styles[order.status]}`}>
                                                        {order.status.replace('_', ' ')}
                                                    </span>
                                                    <strong>₦{order.total.toLocaleString()}</strong>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.empty}>
                                        <i className="ri-shopping-bag-line"></i>
                                        <h3>No orders yet</h3>
                                        <p>Items you buy will appear here.</p>
                                        <Link href="/shop" className="btn btn-outline">Go Shopping</Link>
                                    </div>
                                )
                            }
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div className={styles.listContainer}>
                            <h2 className={styles.sectionTitle}>My Listings</h2>
                            {loadingData ? <p>Loading listings...</p> :
                                listings.length > 0 ? (
                                    <div className={styles.list}>
                                        {listings.map(item => (
                                            <div key={item._id} className={styles.listItem}>
                                                <div className={styles.itemMain}>
                                                    <img src={item.image} alt="" className={styles.itemImg} />
                                                    <div className={styles.itemInfo}>
                                                        <strong>{item.title}</strong>
                                                        <span>{item.category}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.itemStatus}>
                                                    <strong>₦{item.price.toLocaleString()}</strong>
                                                    <div className={styles.itemActions}>
                                                        <Link href={`/shop/${item._id}`} className={styles.viewLink}>
                                                            <i className="ri-eye-line"></i> View
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteListing(item._id)}
                                                            className={styles.deleteLink}
                                                        >
                                                            <i className="ri-delete-bin-line"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.empty}>
                                        <i className="ri-list-check"></i>
                                        <h3>No listings yet</h3>
                                        <p>Items you list for sale will appear here.</p>
                                        <Link href="/sell" className="btn btn-outline">Start Selling</Link>
                                    </div>
                                )
                            }
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className={styles.settingsContainer}>
                            <h2 className={styles.sectionTitle}>Settings</h2>

                            <div className={styles.settingsSection}>
                                <h3><i className="ri-user-settings-line"></i> Profile Information</h3>
                                <div className={styles.formGroup}>
                                    <label>Display Name</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        defaultValue={session?.user?.name}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className={styles.formInput}
                                        defaultValue={session?.user?.email}
                                        disabled
                                    />
                                    <p style={{ fontSize: '12px', color: '#8e8e93', marginTop: '4px' }}>
                                        Email cannot be changed for security reasons.
                                    </p>
                                </div>
                                <button className="btn btn-primary" onClick={() => alert('Profile updated!')}>
                                    Save Changes
                                </button>
                            </div>

                            <div className={styles.settingsSection}>
                                <h3><i className="ri-building-4-line"></i> Campus Details</h3>
                                <div className={styles.formGroup}>
                                    <label>Main Campus</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="e.g. University of Lagos"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Hostel / Apartment</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="e.g. Jaja Hall"
                                    />
                                </div>
                                <div className={styles.settingsRow}>
                                    <div className={styles.settingsRowText}>
                                        <strong>Verification Status</strong>
                                        <p>Verify your student ID for higher trust scores.</p>
                                    </div>
                                    <span className={styles.badge_verified}>Verified Student</span>
                                </div>
                            </div>

                            <div className={styles.settingsSection}>
                                <h3><i className="ri-notification-3-line"></i> Notifications</h3>
                                <div className={styles.settingsRow}>
                                    <div className={styles.settingsRowText}>
                                        <strong>Order Updates</strong>
                                        <p>Receive alerts when your order status changes.</p>
                                    </div>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className={styles.settingsRow}>
                                    <div className={styles.settingsRowText}>
                                        <strong>Chat Messages</strong>
                                        <p>Get notified when a buyer or seller messages you.</p>
                                    </div>
                                    <input type="checkbox" defaultChecked />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
