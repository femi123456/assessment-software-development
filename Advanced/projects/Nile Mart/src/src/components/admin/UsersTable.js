"use client";

import UserActions from './UserActions';
import styles from '../../app/admin/admin.module.css';

export default function UsersTable({ users }) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Username</th>
                        <th className={styles.th}>Email</th>
                        <th className={styles.th}>Role</th>
                        <th className={styles.th}>Listings</th>
                        <th className={styles.th}>Total Reports</th>
                        <th className={styles.th}>Strikes</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td className={styles.td}>{user.name}</td>
                            <td className={styles.td}>{user.email}</td>
                            <td className={styles.td}>
                                <span className={styles.badge} style={{ background: user.role === 'admin' ? '#e0e7ff' : '#4338ca', color: user.role === 'admin' ? '#4338ca' : '#ffffff' }}>
                                    {user.role}
                                </span>
                            </td>
                            <td className={styles.td}>{user.listingCount}</td>
                            <td className={styles.td}>{user.reportsAgainst}</td>
                            <td className={styles.td}>{user.strikeCount || 0}</td>
                            <td className={styles.td}>
                                <UserActions user={user} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
