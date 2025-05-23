// src/features/inventory/inventoryService.ts
import type { Product, ProductDto, Category, Supplier, ProductFilters } from '../types/inventory';
import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:8080/api';

class InventoryService {
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader(),
    };
  }

  // Products
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      let url = `${API_BASE_URL}/products`;
      
      if (filters) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.supplierId) params.append('supplierId', filters.supplierId);
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.minQuantity !== undefined) params.append('minQuantity', filters.minQuantity.toString());
        if (filters.maxQuantity !== undefined) params.append('maxQuantity', filters.maxQuantity.toString());
        
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
      }

      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(productData: ProductDto): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create product: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: ProductDto): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update product: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create category: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch suppliers: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create supplier: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();