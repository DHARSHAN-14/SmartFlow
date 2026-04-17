import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = '/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('sf_token') || null);
    const [ready, setReady] = useState(false);

    // Restore session from localStorage
    useEffect(() => {
        const restore = async () => {
            const stored = localStorage.getItem('sf_token');
            if (!stored) { setReady(true); return; }
            try {
                const res = await axios.get(`${API_BASE}/auth/me`, {
                    headers: { Authorization: `Bearer ${stored}` },
                });
                setUser(res.data.user);
                setToken(stored);
            } catch {
                localStorage.removeItem('sf_token');
                setToken(null);
            } finally {
                setReady(true);
            }
        };
        restore();
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
        localStorage.setItem('sf_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
    }, []);

    const register = useCallback(async (name, email, password) => {
        const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
        localStorage.setItem('sf_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('sf_token');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, ready, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
