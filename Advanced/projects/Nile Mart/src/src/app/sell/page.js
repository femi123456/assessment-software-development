"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Sell() {
    const { status, data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: 'Textbooks',
        description: '',
        image: ''
    });

    if (status === 'loading') return null;
    if (status === 'unauthenticated') {
        return (
            <div className={`container ${styles.authPage}`}>
                <div className={styles.authCard}>
                    <i className="ri-store-2-line"></i>
                    <h1>Start selling on Nile Mart</h1>
                    <p>Please sign in to your student account to list items for sale.</p>
                    <Link href="/login" className="btn btn-primary">Sign In to Continue</Link>
                </div>
            </div>
        );
    }

    if (session?.user?.canPost === false) {
        return (
            <div className={`container ${styles.authPage}`}>
                <div className={styles.authCard} style={{ borderColor: '#df2020' }}>
                    <i className="ri-error-warning-line" style={{ color: '#df2020' }}></i>
                    <h1 style={{ color: '#df2020' }}>Account Restricted</h1>
                    <p>Your ability to post new listings has been temporarily suspended due to multiple rule violations.</p>
                    <Link href="/shop" className="btn btn-secondary">Back to Shop</Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    seller: session.user.name,
                    sellerEmail: session.user.email
                }),
            });

            if (res.ok) {
                router.push('/shop');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to list product');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.layout}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>List your product</h1>
                    <p className={styles.subtitle}>Fill in the details below to list your item on the marketplace.</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.inputGroup}>
                            <label>Product Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Calculus: Early Transcendentals"
                                className={styles.input}
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Price (₦)</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="0.00"
                                    className={styles.input}
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Category</label>
                                <select
                                    name="category"
                                    className={styles.select}
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option>Textbooks</option>
                                    <option>Electronics</option>
                                    <option>Hostel</option>
                                    <option>Fashion</option>
                                    <option>Sports</option>
                                    <option>Others</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Product Image</label>
                            <div className={styles.imageOptions}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, image: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <div className={styles.divider}>OR</div>
                                <input
                                    type="url"
                                    name="image"
                                    placeholder="Paste Image URL (e.g. https://...)"
                                    className={styles.input}
                                    value={formData.image.startsWith('data:') ? '' : formData.image}
                                    onChange={handleChange}
                                />
                            </div>
                            {formData.image && (
                                <div className={styles.imagePreview}>
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        loading="lazy"
                                    />
                                    <button
                                        type="button"
                                        className={styles.removeImage}
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe your item's condition, features, etc."
                                className={styles.textarea}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                            {loading ? 'Listing Product...' : 'List Product'}
                        </button>
                    </form>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.infoCard}>
                        <h3>Selling Tips</h3>
                        <ul>
                            <li>Use high-quality photos to attract buyers.</li>
                            <li>Be honest about the item's condition.</li>
                            <li>Price your items competitively for your campus.</li>
                            <li>Meet in public campus locations for handovers.</li>
                        </ul>
                    </div>
                    <div className={styles.feeNotice}>
                        <i className="ri-medal-line"></i>
                        <div>
                            <strong>0% Selling Fee</strong>
                            <p>Trading on Nile Mart is free for all students.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
