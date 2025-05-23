// src/types/auth.ts
export interface User {
    id: string;
    email: string;
    fullName: string;
    status: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Role {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    roleName: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    hasRole: (roleName: string) => boolean;
    hasAnyRole: (roleNames: string[]) => boolean;
  }
  
  export interface AuthError {
    message: string;
    status?: number;
  }