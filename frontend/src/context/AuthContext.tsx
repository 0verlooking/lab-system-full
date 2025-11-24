import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'ADMIN' | 'USER' | string;

interface AuthState {
    token: string | null;
    role: Role | null;
}

interface AuthContextType extends AuthState {
    login: (token: string, role: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedRole = localStorage.getItem('auth_role');
        if (savedToken) setToken(savedToken);
        if (savedRole) setRole(savedRole as Role);
    }, []);

    const login = (newToken: string, newRole: Role) => {
        setToken(newToken);
        setRole(newRole);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_role', newRole);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};
