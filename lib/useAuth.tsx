import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';
import { getToken, setToken, clearToken } from './auth';
import { ENV } from "../config/env";

type AuthCtx = {
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

type LoginRes = { token: string; user: { id: string; email: string } };

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTok] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTok(getToken());
        setLoading(false);
    }, []);

    console.log('API_URL =', ENV.API_URL);

    async function login(email: string, password: string) {
        const res = await api('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        }) as LoginRes;

        if (!res?.token) throw new Error('No token returned');
        setToken(res.token);
        setTok(res.token);
    }

    function logout() {
        clearToken();
        setTok(null);
    }

    return (
        <Ctx.Provider value={{ token, loading, login, logout }}>
            {children}
        </Ctx.Provider>
    );
}

export function useAuth() {
    const v = useContext(Ctx);
    if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
    return v;
}
