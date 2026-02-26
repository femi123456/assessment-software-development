"use client";

import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const Navbar = () => {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Shop', path: '/shop' },
        { name: 'Sell', path: '/sell' },
        { name: status === 'authenticated' ? 'Messages' : '', path: status === 'authenticated' ? '/messages' : '' },
        { name: status === 'unauthenticated' ? 'Sign In' : '', path: status === 'unauthenticated' ? '/login' : '' },
    ].filter(link => link.name !== '');

    const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navInner}`}>
                <Link href="/" className={styles.bridge}>
                    <span className={styles.logoText}>Nile Mart</span>
                </Link>

                <div className={styles.rightSide}>
                    <div className={`${styles.links} ${isMenuOpen ? styles.menuOpen : ''}`}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className={styles.navActions}>
                        <Link href="/cart" className={styles.cartIcon}>
                            <i className="ri-shopping-bag-line"></i>
                            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                        </Link>

                        {status === 'authenticated' && (
                            <Link href="/profile" className={`${styles.navLink} ${styles.avatarLink} ${pathname === '/profile' ? styles.active : ''}`}>
                                <div className={styles.avatarCircle}>
                                    {userInitial}
                                </div>
                            </Link>
                        )}

                        <button
                            className={styles.menuToggle}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
