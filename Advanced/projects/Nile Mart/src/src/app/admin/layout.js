"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./admin.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
            router.push("/");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return <div className="loading-container">Loading Admin...</div>;
    }

    if (!session || session.user.role !== "admin") {
        return null; // or a custom 403 page
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: "ri-dashboard-line" },
        { label: "Listings", href: "/admin/listings", icon: "ri-list-check" },
        { label: "Reports", href: "/admin/reports", icon: "ri-feedback-line" },
        { label: "Users", href: "/admin/users", icon: "ri-group-line" },
    ];

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#df2020' }}>Admin Panel</h2>
                </div>
                <nav>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${pathname === item.href ? styles.activeNavLink : ''}`}
                        >
                            <i className={item.icon}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
