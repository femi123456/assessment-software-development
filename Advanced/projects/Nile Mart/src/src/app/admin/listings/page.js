import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import styles from "../admin.module.css";
import ListingsTable from "@/components/admin/ListingsTable";

export const dynamic = 'force-dynamic';

async function getListings(statusFilter) {
    await dbConnect();
    const filter = {};
    if (statusFilter && statusFilter !== 'all') {
        if (statusFilter === 'reported') {
            filter.reportsCount = { $gt: 0 };
        } else {
            filter.status = statusFilter;
        }
    }
    const listings = await Product.find(filter).sort({ reportsCount: -1, createdAt: -1 }).lean();
    return listings.map(l => ({
        ...l,
        _id: l._id.toString(),
        createdAt: l.createdAt?.toISOString(),
        updatedAt: l.updatedAt?.toISOString()
    }));
}

export default async function ListingsManager({ searchParams }) {
    const { status = 'all' } = await searchParams;
    const listings = await getListings(status);

    return (
        <div>
            <div className={styles.header}>
                <h1>Listings Manager</h1>
                <p>Approve, review, or delete product listings</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <a href="/admin/listings?status=all" className={`${styles.actionBtn} ${status === 'all' ? styles.activeNavLink : ''}`}>All</a>
                <a href="/admin/listings?status=pending_review" className={`${styles.actionBtn} ${status === 'pending_review' ? styles.activeNavLink : ''}`}>Pending Review</a>
                <a href="/admin/listings?status=reported" className={`${styles.actionBtn} ${status === 'reported' ? styles.activeNavLink : ''}`}>Reported</a>
                <a href="/admin/listings?status=deleted" className={`${styles.actionBtn} ${status === 'deleted' ? styles.activeNavLink : ''}`}>Deleted</a>
            </div>

            <ListingsTable listings={listings} />
        </div>
    );
}
