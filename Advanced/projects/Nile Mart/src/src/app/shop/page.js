import styles from './page.module.css';
import ProductCard from '@/components/product/ProductCard';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import SearchBar from '@/components/product/SearchBar';
import { Suspense } from 'react';

async function getProducts(searchParams) {
    try {
        await dbConnect();
        const query = {};

        if (searchParams.q) {
            query.title = { $regex: searchParams.q, $options: 'i' };
        }

        if (searchParams.category) {
            query.category = searchParams.category;
        }

        const products = await Product.find(query).sort({ createdAt: -1 }).lean();
        return products.map(doc => ({
            ...doc,
            _id: doc._id.toString(),
            id: doc._id.toString(),
            createdAt: doc.createdAt?.toISOString(),
            updatedAt: doc.updatedAt?.toISOString(),
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export const dynamic = 'force-dynamic';

export default async function Shop(props) {
    const searchParams = await props.searchParams;
    const products = await getProducts(searchParams);
    const categories = ['All', 'Textbooks', 'Electronics', 'Hostel', 'Fashion', 'Sports', 'Others'];

    return (
        <div className="container">
            <div className={styles.shopHeader}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>
                        {searchParams.q ? `Results for "${searchParams.q}"` : 'All Products'}
                    </h1>
                    <p className={styles.productCount}>{products.length} items available</p>
                </div>

                <div className={styles.searchArea}>
                    <Suspense fallback={<div>Loading search...</div>}>
                        <SearchBar initialValue={searchParams.q} />
                    </Suspense>
                </div>

                <div className={styles.filters}>
                    <div className={styles.categoryList}>
                        {categories.map(cat => (
                            <a
                                key={cat}
                                href={`/shop${cat === 'All' ? '' : `?category=${cat}`}`}
                                className={`${styles.categoryTab} ${(searchParams.category === cat || (!searchParams.category && cat === 'All'))
                                    ? styles.activeTab : ''
                                    }`}
                            >
                                {cat}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.productGrid}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <i className="ri-search-2-line"></i>
                        <h3>No results found</h3>
                        <p>Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
