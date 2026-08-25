import React, { createContext, useContext, useState } from 'react';
import { apiClient } from '../api/client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'DISPATCHER' | 'TECHNICIAN' | 'ACCOUNTANT';
  organizationId: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (orgName: string, name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('fieldloop_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fieldloop_token') || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user: userData, tokens } = response.data.data;
      
      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem('fieldloop_user', JSON.stringify(userData));
      localStorage.setItem('fieldloop_token', tokens.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (orgName: string, name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', { orgName, name, email, password });
      const { user: userData, tokens } = response.data.data;

      setUser(userData);
      setToken(tokens.accessToken);
      localStorage.setItem('fieldloop_user', JSON.stringify(userData));
      localStorage.setItem('fieldloop_token', tokens.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fieldloop_user');
    localStorage.removeItem('fieldloop_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!token,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
