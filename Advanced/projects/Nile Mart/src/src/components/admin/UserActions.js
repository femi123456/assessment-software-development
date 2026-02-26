"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../app/admin/admin.module.css';

export default function UserActions({ user }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (action) => {
        let confirmMsg = '';
        if (action === 'block') confirmMsg = 'Are you sure you want to block this user? They will not be able to post new listings.';
        if (action === 'resetStrikes') confirmMsg = 'Are you sure you want to reset this user\'s strikes to zero?';

        if (confirmMsg && !confirm(confirmMsg)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    targetId: user._id,
                    targetType: 'user'
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
                onClick={() => handleAction('warn')}
                disabled={loading}
            >
                Warn
            </button>
            <button
                className={styles.actionBtn}
                onClick={() => handleAction(user.canPost === false ? 'unblock' : 'block')}
                disabled={loading}
                style={{ color: user.canPost === false ? '#166534' : '#991b1b' }}
            >
                {user.canPost === false ? 'Unblock' : 'Block'}
            </button>
            <button
                className={styles.actionBtn}
                onClick={() => handleAction('resetStrikes')}
                disabled={loading}
            >
                Reset
            </button>
        </div>
    );
}
