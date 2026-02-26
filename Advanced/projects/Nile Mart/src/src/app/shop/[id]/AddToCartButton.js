"use client";

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            className={`btn btn-primary ${added ? 'btn-success' : ''}`}
            onClick={handleAdd}
            style={{ width: '100%' }}
        >
            {added ? (
                <>
                    <i className="ri-check-line"></i> Added to Bag
                </>
            ) : (
                <>
                    <i className="ri-shopping-bag-line"></i> Add to Bag
                </>
            )}
        </button>
    );
}
