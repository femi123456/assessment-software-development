"use client";

import { useEffect, useState } from 'react';
import styles from './ReportViewModal.module.css';

export default function ReportViewModal({ product, onClose }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            try {
                // We'll create a simple endpoint or filter the existing reports
                const res = await fetch(`/api/reports?productId=${product._id}`);
                const data = await res.json();
                if (data.success) {
                    setReports(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchReports();
    }, [product._id]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Reports for "{product.title}"</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.content}>
                    {loading ? <p>Loading reports...</p> : reports.length > 0 ? (
                        <div className={styles.reportList}>
                            {reports.map((report) => (
                                <div key={report._id} className={styles.reportItem}>
                                    <div className={styles.reportMeta}>
                                        <strong>{report.reportedByUserId?.name || 'Unknown User'}</strong>
                                        <span>{new Date(report.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className={styles.reason}>{report.reason}</p>
                                    {report.otherReason && <p className={styles.details}>{report.otherReason}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No detailed reports found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
