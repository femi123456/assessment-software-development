"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../app/admin/admin.module.css';

export default function ListingActions({ item, onViewReports }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (action) => {
        if (action === 'delete' && !confirm('Are you sure you want to delete this listing? The seller will receive a strike.')) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    targetId: item._id,
                    targetType: 'product'
                })
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to perform action');
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                className={styles.actionBtn}
                onClick={() => onViewReports(item)}
            >
                View
            </button>
            {item.status !== 'approved' && (
                <button
                    className={styles.actionBtn}
                    style={{ color: '#166534' }}
                    onClick={() => handleAction('approve')}
                    disabled={loading}
                >
                    {loading ? '...' : 'Approve'}
                </button>
            )}
            {item.status !== 'deleted' && (
                <button
                    className={styles.actionBtn}
                    style={{ color: '#991b1b' }}
                    onClick={() => handleAction('delete')}
                    disabled={loading}
                >
                    {loading ? '...' : 'Delete'}
                </button>
            )}
        </div>
    );
}
