// src/contexts/AuthContext.tsx
import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (user: User) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
  login: (credentials: LoginRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setIsLoading(false);
      return parsedUser;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      setIsLoading(false);
      return null;
    }
  });

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authCredentials');
    authService.logout();
  }, []);

  const hasRole = useCallback((roleName: string): boolean => {
    if (!user) return false;
    return user.role.name === roleName;
  }, [user]);

  const hasAnyRole = useCallback((roleNames: string[]): boolean => {
    if (!user) return false;
    return roleNames.includes(user.role.name);
  }, [user]);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    updateUser,
    setUser,
    logout,
    hasRole,
    hasAnyRole,
    login
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};