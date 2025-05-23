export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  categoryId: string;
  supplierId: string;
  category?: Category;
  supplier?: Supplier;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDto extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'supplier'> {
  categoryId: string;
  supplierId: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
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
  sortBy?: 'name' | 'price' | 'quantity' | 'createdAt';
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
