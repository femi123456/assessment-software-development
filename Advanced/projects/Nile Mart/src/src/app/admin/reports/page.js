import dbConnect from "@/lib/mongodb";
import Report from "@/models/Report";
import Product from "@/models/Product";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

async function getReports() {
    await dbConnect();
    // Populate product and reporter details
    return await Report.find({})
        .populate('productId', 'title')
        .populate('reportedByUserId', 'name')
        .sort({ createdAt: -1 })
        .lean();
}

export default async function ReportsViewer() {
    const reports = await getReports();

    return (
        <div>
            <div className={styles.header}>
                <h1>Safety Reports</h1>
                <p>Review user reports and take action</p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Time</th>
                            <th className={styles.th}>Product</th>
                            <th className={styles.th}>Reporter</th>
                            <th className={styles.th}>Reason</th>
                            <th className={styles.th}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id.toString()}>
                                <td className={styles.td}>{new Date(report.createdAt).toLocaleString()}</td>
                                <td className={styles.td}>{report.productId?.title || 'Deleted Product'}</td>
                                <td className={styles.td}>{report.reportedByUserId?.name || 'Unknown'}</td>
                                <td className={styles.td}>{report.reason}</td>
                                <td className={styles.td}>{report.otherReason || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
