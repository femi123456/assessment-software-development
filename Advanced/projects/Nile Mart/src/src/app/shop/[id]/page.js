import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductDetailActions from '@/components/product/ProductDetailActions';

async function getProduct(id) {
    if (!id || id === 'undefined') return null;
    try {
        await dbConnect();
        const product = await Product.findById(id).lean();
        if (!product) return null;
        return {
            ...product,
            _id: product._id.toString(),
            id: product._id.toString(),
            createdAt: product.createdAt?.toISOString(),
            updatedAt: product.updatedAt?.toISOString(),
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.productGrid}>
                <div className={styles.imageSection}>
                    <div className={styles.imageContainer}>
                        <Image
                            src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'}
                            alt={product.title}
                            fill
                            className={styles.image}
                            priority
                            unoptimized={product.image?.startsWith('data:') || product.image?.includes('gstatic.com') || product.image?.includes('tbn:')}
                        />
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.header}>
                        <Link href={`/shop?category=${product.category}`} className={styles.category}>
                            {product.category}
                        </Link>
                        <h1 className={styles.title}>{product.title}</h1>
                        <p className={styles.price}>₦{product.price.toLocaleString()}</p>
                    </div>

                    <div className={styles.description}>
                        <h3>Description</h3>
                        <p>{product.description || 'No description provided for this item.'}</p>
                    </div>

                    <div className={styles.sellerInfo}>
                        <div className={styles.sellerAvatar}>
                            <i className="ri-user-smile-line"></i>
                        </div>
                        <div>
                            <p className={styles.sellerName}>{product.seller || 'Verified Student'}</p>
                            <p className={styles.sellerStatus}>Verified Campus Seller</p>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <ProductDetailActions product={product} />
                        <div className={styles.guarantee}>
                            <i className="ri-shield-check-line"></i>
                            <span>Safe campus pickup guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
