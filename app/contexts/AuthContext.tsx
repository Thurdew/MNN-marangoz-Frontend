'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  kullaniciAdi: string;
  rol: 'admin' | 'musteri';
  adSoyad: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (kullaniciAdi: string, sifre: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Railway Backend URL
  const BACKEND_URL = 'https://keen-sparkle-production.up.railway.app';

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (kullaniciAdi: string, sifre: string) => {
    // Localhost yerine Railway adresi kullanıldı
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kullaniciAdi, sifre })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Giriş başarısız');
    }

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin-login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.rol === 'admin',
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}