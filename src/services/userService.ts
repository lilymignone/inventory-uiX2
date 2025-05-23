// src/services/userService.ts
import axios from 'axios';
import type { User } from '../types/user';

const API_URL = '/api/users';

export interface CreateUserDto {
  email: string;
  fullName: string;
  password: string;
  roleName: string;
  status: string;
}

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await axios.post(API_URL, userData);
    return response.data;
  },

  updateUserStatus: async (userId: number, status: string): Promise<User> => {
    const response = await axios.patch(`${API_URL}/${userId}/status?status=${status}`);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${userId}`);
  }
}; 