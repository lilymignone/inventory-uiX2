// src/services/authService.ts
import type{ LoginRequest, RegisterRequest, User } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080';

class AuthService {
  private currentUser: User | null = null;
  private credentials: string | null = null;

  async login(loginData: LoginRequest): Promise<User> {
    try {
      // First, attempt login
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        throw new Error(`Login failed: ${errorText}`);
      }

      // Store credentials for basic auth
      const basicAuth = btoa(`${loginData.email}:${loginData.password}`);
      this.credentials = basicAuth;

      // Get user profile
      const userResponse = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
        },
      });

      if (!userResponse.ok) {
        // If we can't get user profile, try to get current user info differently
        // For now, we'll create a basic user object from the login info
        const user: User = {
          id: 'current-user',
          email: loginData.email,
          fullName: loginData.email.split('@')[0], // Fallback name
          status: 'ACTIVE',
          role: {
            id: 'role-id',
            name: 'USER',
            description: 'User role',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        this.currentUser = user;
        this.storeAuthData(basicAuth, user);
        return user;
      }

      const user = await userResponse.json();
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${errorText}`);
      }

      const user = await response.json();
      
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