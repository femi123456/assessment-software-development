"use client";

import React, { useState, useEffect } from 'react';
import styles from './Wallet.module.css';

const WalletDashboard = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fundAmount, setFundAmount] = useState('');
    const [showFundModal, setShowFundModal] = useState(false);

    const fetchWalletData = async () => {
        try {
            const res = await fetch('/api/wallet');
            const data = await res.json();
            if (data.success) {
                setWalletData(data.data);
            }
        } catch (error) {
            console.error('Error fetching wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleFund = async (e) => {
        e.preventDefault();
        if (!fundAmount || fundAmount <= 0) return;

        try {
            const res = await fetch('/api/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: fundAmount,
                    type: 'fund',
                    description: 'Fund via Card (Mock)'
                })
            });
            const data = await res.json();
            if (data.success) {
                setFundAmount('');
                setShowFundModal(false);
                fetchWalletData();
            }
        } catch (error) {
            console.error('Error funding wallet:', error);
        }
    };

    if (loading) return <div>Loading wallet...</div>;

    return (
        <div className={styles.walletContainer}>
            <div className={styles.balanceCard}>
                <div className={styles.balanceInfo}>
                    <span className={styles.label}>Available Balance</span>
                    <h2 className={styles.amount}>₦{walletData?.balance?.toLocaleString() || '0'}</h2>
                </div>
                <button
                    className={styles.fundBtn}
                    onClick={() => setShowFundModal(true)}
                >
                    <i className="ri-add-line"></i> Fund Wallet
                </button>
            </div>

            <div className={styles.historySection}>
                <h3 className={styles.sectionTitle}>Transaction History</h3>
                <div className={styles.historyList}>
                    {walletData?.transactions?.length > 0 ? (
                        walletData.transactions.map((tx) => (
                            <div key={tx._id} className={styles.historyItem}>
                                <div className={`${styles.iconCircle} ${styles[tx.type]}`}>
                                    <i className={
                                        tx.type === 'fund' ? 'ri-arrow-down-line' :
                                            tx.type === 'withdraw' ? 'ri-arrow-up-line' :
                                                tx.type === 'payment' ? 'ri-shopping-cart-line' :
                                                    'ri-exchange-line'
                                    }></i>
                                </div>
                                <div className={styles.txInfo}>
                                    <span className={styles.txDesc}>{tx.description}</span>
                                    <span className={styles.txDate}>{new Date(tx.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className={`${styles.txAmount} ${tx.type === 'fund' || tx.type === 'receive' ? styles.plus : styles.minus}`}>
                                    {tx.type === 'fund' || tx.type === 'receive' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyHistory}>No transactions yet</div>
                    )}
                </div>
            </div>

            {showFundModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Fund Wallet</h3>
                            <button onClick={() => setShowFundModal(false)} className={styles.closeBtn}>×</button>
                        </div>
                        <form onSubmit={handleFund}>
                            <p>Enter amount to add to your NileMart wallet.</p>
                            <div className={styles.inputGroup}>
                                <label>Amount (₦)</label>
                                <input
                                    type="number"
                                    placeholder="5000"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.submitBtn}>Continue to Payment</button>
                            </div>
                            <p className={styles.mockNotice}>This is a mock payment for testing purposes.</p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletDashboard;
