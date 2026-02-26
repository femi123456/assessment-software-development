import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import styles from "../admin.module.css";
import UsersTable from "@/components/admin/UsersTable";

export const dynamic = 'force-dynamic';

async function getUsers() {
    await dbConnect();
    const users = await User.find({}).lean();

    // Enrich users with listing counts
    const usersWithStats = await Promise.all(users.map(async (user) => {
        const userIdString = user._id.toString();
        const listingCount = await Product.countDocuments({ sellerId: userIdString });
        const totalReports = await Product.aggregate([
            { $match: { sellerId: userIdString } },
            { $group: { _id: null, total: { $sum: "$reportsCount" } } }
        ]);

        return {
            ...user,
            listingCount,
            reportsAgainst: totalReports[0]?.total || 0,
            _id: userIdString,
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString()
        };
    }));

    return usersWithStats;
}

export default async function UserManagement() {
    const users = await getUsers();

    return (
        <div>
            <div className={styles.header}>
                <h1>User Management</h1>
                <p>Manage community members and enforce rules</p>
            </div>

            <UsersTable users={users} />
        </div>
    );
}
