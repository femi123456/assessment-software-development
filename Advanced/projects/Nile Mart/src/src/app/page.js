import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import SearchBar from '@/components/product/SearchBar';
import { Suspense } from 'react';

async function getProducts() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8).lean();
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

export default async function Home() {
  const products = await getProducts();

  const categories = [
    {
      name: 'Textbooks',
      icon: 'ri-book-open-line',
      color: '#007aff',
      image: '/category-textbooks.png',
      description: 'Find essentials for your courses at lower prices.',
      size: 'large'
    },
    {
      name: 'Electronics',
      icon: 'ri-macbook-line',
      color: '#5856d6',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      description: 'Laptops, headphones, and student tech.',
      size: 'medium'
    },
    {
      name: 'Hostel',
      icon: 'ri-home-wifi-line',
      color: '#ff9500',
      image: 'https://images.unsplash.com/photo-1554941068-a252680d25d9?w=800',
      description: 'Furniture and essentials for your room.',
      size: 'small'
    },
    {
      name: 'Fashion',
      icon: 'ri-t-shirt-2-line',
      color: '#ff2d55',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
      description: 'Campus styles and pre-loved outfits.',
      size: 'small'
    },
    {
      name: 'Sports',
      icon: 'ri-basketball-line',
      color: '#34c759',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      description: 'Gear for athletes and weekend warriors.',
      size: 'medium'
    },
    {
      name: 'Others',
      icon: 'ri-more-fill',
      color: '#8e8e93',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800',
      description: 'Everything else you might need.',
      size: 'small'
    },
  ];

  return (
    <div className={styles.main}>
      <header className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.title}>
            The marketplace for <span className={styles.gradientText}>university students.</span>
          </h1>
          <p className={styles.subtitle}>
            Buy and sell textbooks, electronics, and hostel essentials with zero commission.
            Exclusively for your campus.
          </p>
          <div className={styles.heroSearch}>
            <Suspense fallback={<div>Loading...</div>}>
              <SearchBar placeholder="What are you looking for today?" />
            </Suspense>
          </div>
          <div className={styles.actions}>
            <Link href="/shop" className="btn btn-primary">Browse Marketplace</Link>
            <Link href="/sell" className="btn btn-secondary">Start Selling</Link>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link
                href={`/shop?category=${cat.name}`}
                key={cat.name}
                className={`${styles.categoryCard} ${styles[cat.size]}`}
              >
                <div className={styles.categoryBg}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className={styles.bgImage}
                  />
                </div>
                <div className={styles.categoryContent}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryIcon} style={{ background: cat.color }}>
                      <i className={cat.icon}></i>
                    </div>
                    <span className={styles.categoryName}>{cat.name}</span>
                  </div>
                  <p className={styles.categoryDesc}>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Products</h2>
            <Link href="/shop" className={styles.viewAll}>View all <i className="ri-arrow-right-line"></i></Link>
          </div>
          <div className={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className={styles.empty}>No products found. Be the first to list something!</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
