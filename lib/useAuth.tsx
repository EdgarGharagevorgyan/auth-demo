import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';
import { getToken, setToken, clearToken } from './auth';

type AuthContextType = {
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoadingState] = useState(true);

    useEffect(() => {
        setTokenState(getToken());
        setLoadingState(false);
    }, []);

    async function login(email: string, password: string) {
        const response = await api('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        if (!response?.token) throw new Error('No token returned');
        setToken(response.token);
        setTokenState(response.token);
    }

    function logout() {
        clearToken();
        setTokenState(null);
    }

    return (
        <AuthContext.Provider value={{ token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
    return context;
}
