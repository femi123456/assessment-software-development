import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import Report from "@/models/Report";
import styles from "./admin.module.css";

export const dynamic = 'force-dynamic';

async function getStats() {
    await dbConnect();
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: 'pending_review' });
    const totalReports = await Report.countDocuments();
    const totalUsers = await User.countDocuments();

    return { totalProducts, pendingProducts, totalReports, totalUsers };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className={styles.adminPage}>
            <div className={styles.header}>
                <h1>Dashboard Overview</h1>
                <p>Monitor Nile Mart activity and moderation</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Listings</h3>
                    <div className={styles.statValue}>{stats.totalProducts}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Pending Review</h3>
                    <div className={styles.statValue} style={{ color: '#854d0e' }}>{stats.pendingProducts}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Reports</h3>
                    <div className={styles.statValue}>{stats.totalReports}</div>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Users</h3>
                    <div className={styles.statValue}>{stats.totalUsers}</div>
                </div>
            </div>

            <div className={styles.tableWrapper} style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Welcome, Administrator</h3>
                <p>Use the sidebar to manage listings, view reports, and manage users. System health is normal.</p>
            </div>
        </div>
    );
}
