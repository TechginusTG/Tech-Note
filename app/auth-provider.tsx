'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
    user: any | null;
    isLoading: boolean;
    setUser: (user: any | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status, update } = useSession();
    const isLoading = status === 'loading';

    const setUser = (user: any | null) => {
        update(user);
    }

    return (
        <AuthContext.Provider value={{ user: session?.user || null, isLoading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};