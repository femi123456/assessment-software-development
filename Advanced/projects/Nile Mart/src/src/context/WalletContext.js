"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const { data: session, status } = useSession();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchBalance = async () => {
        if (status !== 'authenticated') return;
        setLoading(true);
        try {
            const res = await fetch('/api/wallet');
            const data = await res.json();
            if (data.success) {
                setBalance(data.data.balance);
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [status]);

    return (
        <WalletContext.Provider value={{ balance, loading, fetchBalance }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}
