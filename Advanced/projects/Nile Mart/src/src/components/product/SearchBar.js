"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchBar.module.css';

export default function SearchBar({ placeholder = "Search for textbooks, electronics...", initialValue = "" }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialValue || searchParams.get('q') || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
            params.set('q', query.trim());
        } else {
            params.delete('q');
        }
        // Always go to shop page for search results
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <form className={styles.searchContainer} onSubmit={handleSearch}>
            <div className={styles.inputWrapper}>
                <i className="ri-search-line"></i>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <button type="submit" className={styles.searchBtn}>Search</button>
        </form>
    );
}
