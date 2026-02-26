import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <div className={styles.brandTitle}>
                            <i className="ri-shopping-bag-3-fill" style={{ color: 'var(--accent)' }}></i>
                            <span>Nile Mart</span>
                        </div>
                        <p className={styles.brandDesc}>
                            The premium marketplace for university students. Buy, sell, and connect with your campus community securely and instantly.
                        </p>
                        <input
                            type="email"
                            placeholder="Subscribe to our newsletter"
                            className={styles.newsletterInput}
                        />
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className={styles.columnTitle}>Shop</h4>
                        <div className={styles.linkList}>
                            <Link href="/shop" className={styles.link}>All Products</Link>
                            <Link href="/shop?q=Textbooks" className={styles.link}>Textbooks</Link>
                            <Link href="/shop?q=Electronics" className={styles.link}>Electronics</Link>
                            <Link href="/shop?q=Fashion" className={styles.link}>Fashion</Link>
                        </div>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className={styles.columnTitle}>Company</h4>
                        <div className={styles.linkList}>
                            <Link href="/about" className={styles.link}>About Us</Link>
                            <Link href="/careers" className={styles.link}>Careers</Link>
                            <Link href="/blog" className={styles.link}>Blog</Link>
                            <Link href="/sell" className={styles.link}>Start Selling</Link>
                        </div>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className={styles.columnTitle}>Support</h4>
                        <div className={styles.linkList}>
                            <Link href="/help" className={styles.link}>Help Center</Link>
                            <Link href="/safety" className={styles.link}>Safety & Trust</Link>
                            <Link href="/guidelines" className={styles.link}>Community Guidelines</Link>
                            <Link href="/contact" className={styles.link}>Contact Us</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <div>&copy; {new Date().getFullYear()} Nile Mart Inc. All rights reserved.</div>
                    <div className={styles.socialIcons}>
                        <a href="#" className={styles.socialIcon} aria-label="Twitter"><i className="ri-twitter-x-line"></i></a>
                        <a href="#" className={styles.socialIcon} aria-label="Instagram"><i className="ri-instagram-line"></i></a>
                        <a href="#" className={styles.socialIcon} aria-label="LinkedIn"><i className="ri-linkedin-fill"></i></a>
                        <a href="#" className={styles.socialIcon} aria-label="GitHub"><i className="ri-github-line"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
