// src/services/authService.ts
import axios from 'axios';
import type { LoginRequest, RegisterRequest, User } from '../types/auth';
import { config } from '../config/config';

// Use the API URL from config
const API_BASE_URL = config.API_BASE_URL;

class AuthService {
  private currentUser: User | null = null;
  private credentials: string | null = null;

  async login(loginData: LoginRequest): Promise<User> {
    try {
      // Use relative URL since we have proxy configuration
      const loginResponse = await axios.post('/auth/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      // Store credentials for basic auth
      const basicAuth = btoa(`${loginData.email}:${loginData.password}`);
      this.credentials = basicAuth;

      // Since your backend doesn't have a user profile endpoint, 
      // create a user object with default admin/manager roles
      const user: User = {
        id: 'current-user',
        email: loginData.email,
        fullName: this.getNameFromEmail(loginData.email),
        status: 'ACTIVE',
        role: this.determineRole(loginData.email),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      this.currentUser = user;
      this.storeAuthData(basicAuth, user);
      return user;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  async register(registerData: RegisterRequest): Promise<User> {
    try {
      const response = await axios.post('/auth/register', registerData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const user = response.data;
      
      // After successful registration, log the user in
      await this.login({
        email: registerData.email,
        password: registerData.password,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.currentUser = null;
    this.credentials = null;
    this.clearAuthData();
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to load from storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }

    return null;
  }

  getAuthHeader(): Record<string, string> {
    const credentials = this.credentials || localStorage.getItem('authCredentials');
    if (credentials) {
      return {
        'Authorization': `Basic ${credentials}`,
      };
    }
    return {};
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user?.role.name === roleName;
  }

  hasAnyRole(roleNames: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roleNames.includes(user.role.name) : false;
  }

  private determineRole(email: string) {
    // Default role determination based on email
    if (email === 'admin@inventory.com') {
      return {
        id: 'admin-role',
        name: 'ADMIN',
        description: 'System Administrator with full access',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else if (email === 'manager@inventory.com') {
      return {
        id: 'manager-role',
        name: 'MANAGER',
        description: 'Manager with limited access',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      return {
        id: 'user-role',
        name: 'USER',
        description: 'Regular user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  private getNameFromEmail(email: string): string {
    if (email === 'admin@inventory.com') return 'System Administrator';
    if (email === 'manager@inventory.com') return 'Inventory Manager';
    
    // Extract name from email
    const localPart = email.split('@')[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  private storeAuthData(credentials: string, user: User): void {
    localStorage.setItem('authCredentials', credentials);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('authCredentials');
    localStorage.removeItem('user');
  }

  // Initialize auth state from storage
  initializeAuth(): void {
    const storedCredentials = localStorage.getItem('authCredentials');
    const storedUser = localStorage.getItem('user');
    
    if (storedCredentials && storedUser) {
      this.credentials = storedCredentials;
      this.currentUser = JSON.parse(storedUser);
    }
  }
}

export const authService = new AuthService();