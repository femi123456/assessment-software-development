"use client";

import { useState } from 'react';
import styles from './ReportModal.module.css';

export default function ReportModal({ productId, onClose }) {
    const [reason, setReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const reasons = [
        'Scam / Fake item',
        'Inappropriate content',
        'Wrong category',
        'Harassment',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason || (reason === 'Other' && !otherReason)) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    reason,
                    otherReason
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <div className={styles.successMessage}>
                        <i className="ri-checkbox-circle-fill"></i>
                        <h2>Report Submitted</h2>
                        <p>Thank you for helping keep Nile Mart safe. Our moderators will review this listing.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Report Listing</h2>
                <p>Why are you reporting this item?</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.options}>
                        {reasons.map((r) => (
                            <label key={r} className={styles.optionLabel}>
                                <input
                                    type="radio"
                                    name="reason"
                                    value={r}
                                    checked={reason === r}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                {r}
                            </label>
                        ))}
                    </div>

                    {reason === 'Other' && (
                        <textarea
                            className={styles.otherInput}
                            placeholder="Please explain the issue..."
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            required
                        />
                    )}

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={submitting || !reason || (reason === 'Other' && !otherReason)}
                        >
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
