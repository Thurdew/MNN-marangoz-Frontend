'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG, API_ENDPOINTS, buildUrl, fetchWithRetry } from '@/lib/api';

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
  logout: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token validation helper
function isValidToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  // Basic JWT format check (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3;
}

// User validation helper
function isValidUser(user: unknown): user is User {
  if (!user || typeof user !== 'object') return false;
  const u = user as Record<string, unknown>;

  return (
    typeof u.id === 'string' &&
    typeof u.kullaniciAdi === 'string' &&
    (u.rol === 'admin' || u.rol === 'musteri') &&
    typeof u.adSoyad === 'string' &&
    typeof u.email === 'string'
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Safely load and validate user data from localStorage
    try {
      const savedToken = localStorage.getItem('token');
      const savedUserStr = localStorage.getItem('user');

      if (savedToken && savedUserStr) {
        // Validate token format
        if (!isValidToken(savedToken)) {
          throw new Error('Invalid token format');
        }

        // Parse and validate user object
        const parsedUser = JSON.parse(savedUserStr);
        if (!isValidUser(parsedUser)) {
          throw new Error('Invalid user data');
        }

        setToken(savedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const login = async (kullaniciAdi: string, sifre: string) => {
    try {
      const url = buildUrl(API_ENDPOINTS.AUTH_LOGIN);
      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kullaniciAdi, sifre })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Giriş başarısız');
      }

      // Validate response data
      if (!data.token || !isValidToken(data.token)) {
        throw new Error('Invalid token received from server');
      }

      if (!isValidUser(data.user)) {
        throw new Error('Invalid user data received from server');
      }

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      // Clear any partial state on error
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Attempt to invalidate token on server
      if (token) {
        const url = buildUrl(API_ENDPOINTS.AUTH_LOGOUT);
        await fetchWithRetry(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).catch(err => {
          // Log but don't fail logout if server call fails
          console.error('Server logout failed:', err);
        });
      }
    } finally {
      // Always clear local state
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin-login';
    }
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