export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
} 