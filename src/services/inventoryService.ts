// src/features/inventory/inventoryService.ts
import axios from 'axios';
import type { Product, ProductDto, Category, Supplier, ProductFilters, CategoryDto, CategoryFilters } from '../types/inventory';
import { authService } from '../services/authService';
import { config } from '../config/config';

const API_BASE_URL = `${config.API_BASE_URL}/api`;

class InventoryService {
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...authService.getAuthHeader()
    };
  }

  // Products
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      let url = `${API_BASE_URL}/products`;
      
      if (filters) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
        if (filters.supplierId) params.append('supplierId', filters.supplierId.toString());
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.minQuantity !== undefined) params.append('minQuantity', filters.minQuantity.toString());
        if (filters.maxQuantity !== undefined) params.append('maxQuantity', filters.maxQuantity.toString());
        
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
      }

      const response = await axios({
        method: 'GET',
        url: url,
        headers: this.getHeaders(),
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(productData: ProductDto): Promise<Product> {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: number, productData: ProductDto): Promise<Product> {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios({
        method: 'GET',
        url: `${API_BASE_URL}/categories`,
        headers: this.getHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(categoryData: CategoryDto): Promise<Category> {
    try {
      // Ensure data is properly formatted as JSON
      const jsonData = JSON.stringify(categoryData);
      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}/categories`,
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        data: jsonData,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, categoryData: CategoryDto): Promise<Category> {
    try {
      // Ensure data is properly formatted as JSON
      const jsonData = JSON.stringify(categoryData);
      const response = await axios({
        method: 'PUT',
        url: `${API_BASE_URL}/categories/${id}`,
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        data: jsonData,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await axios({
        method: 'DELETE',
        url: `${API_BASE_URL}/categories/${id}`,
        headers: this.getHeaders(),
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await axios({
        method: 'GET',
        url: `${API_BASE_URL}/suppliers`,
        headers: this.getHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    try {
      const response = await axios.post(`${API_BASE_URL}/suppliers`, supplierData, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }

  async updateSupplier(id: number, supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    try {
      const response = await axios.put(`${API_BASE_URL}/suppliers/${id}`, supplierData, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  }

  async deleteSupplier(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/suppliers/${id}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  }

  async getCategory(id: number): Promise<Category> {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
    return response.data;
  }
}

export const inventoryService = new InventoryService();