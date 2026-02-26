"use client";

import { useState } from 'react';
import Image from 'next/image';
import ListingActions from './ListingActions';
import ReportViewModal from './ReportViewModal';
import styles from '../../app/admin/admin.module.css';

export default function ListingsTable({ listings }) {
    const [viewingProduct, setViewingProduct] = useState(null);

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Image</th>
                        <th className={styles.th}>Title</th>
                        <th className={styles.th}>Seller</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Reports</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listings.map((item) => (
                        <tr key={item._id.toString()}>
                            <td className={styles.td}>
                                <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                                    <Image
                                        src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                                        alt=""
                                        fill
                                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                                        unoptimized={item.image?.startsWith('data:')}
                                    />
                                </div>
                            </td>
                            <td className={styles.td}>{item.title}</td>
                            <td className={styles.td}>{item.seller}</td>
                            <td className={styles.td}>
                                <span className={`${styles.badge} ${styles['badge-' + item.status]}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className={styles.td}>{item.reportsCount || 0}</td>
                            <td className={styles.td}>
                                <ListingActions
                                    item={item}
                                    onViewReports={(product) => setViewingProduct(product)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {viewingProduct && (
                <ReportViewModal
                    product={viewingProduct}
                    onClose={() => setViewingProduct(null)}
                />
            )}
        </div>
    );
}
