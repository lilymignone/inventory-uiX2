// src/types/inventory.ts
export interface Product {
    id: string;
    name: string;
    description: string;
    availableQuantity: number;  // Changed from 'quantity' to match backend
    unitPrice: number;          // Changed from 'price' to match backend
    category: Category;         // Full category object
    supplier: Supplier;         // Full supplier object
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductDto {
    id?: string;
    name: string;
    description: string;
    availableQuantity: number;
    unitPrice: number;
    categoryId: string;
    supplierId: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CategoryDto {
    name: string;
    description: string;
  }
  
  export interface CategoryFilters {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    companyInfo?: string;  // Added to match backend model
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductFilters {
    search?: string;
    categoryId?: string;
    supplierId?: string;
    minPrice?: number;
    maxPrice?: number;
    minQuantity?: number;
    maxQuantity?: number;
    sortBy?: 'name' | 'unitPrice' | 'availableQuantity' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface InventoryStats {
    totalProducts: number;
    lowStockProducts: number;
    totalCategories: number;
    totalSuppliers: number;
    totalValue: number;
  }