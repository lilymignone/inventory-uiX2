// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    authService.initializeAuth();
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authService.register(userData);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (roleName: string): boolean => {
    return authService.hasRole(roleName);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    return authService.hasAnyRole(roleNames);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};