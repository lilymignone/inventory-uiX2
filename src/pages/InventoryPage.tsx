// src/features/inventory/InventoryPage.tsx
import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { InventoryList } from '../features/inventory/InventoryList';
import { InventoryFilters } from '../features/inventory/components/InventoryFilters';
import { ProductModal } from '../features/inventory/components/ProductModal';
import { inventoryService } from '../services/inventoryService';
import type { Product, ProductDto, ProductFilters, Category, Supplier } from '../types/inventory';

export const InventoryPage: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, suppliersData] = await Promise.all([
        inventoryService.getCategories(),
        inventoryService.getSuppliers(),
      ]);
      
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      
      // Load products after getting categories and suppliers
      await loadProducts();
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load inventory data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await inventoryService.getProducts(filters);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await inventoryService.deleteProduct(deleteConfirm.id);
      await loadProducts();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleSubmitProduct = async (productData: ProductDto) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await inventoryService.updateProduct(editingProduct.id, productData);
      } else {
        await inventoryService.createProduct(productData);
      }
      
      await loadProducts();
      setIsModalOpen(false);
      setEditingProduct(undefined);
    } catch (err) {
      console.error('Error submitting product:', err);
      throw err; // Let the modal handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.unitPrice * product.availableQuantity), 0);
    const lowStockProducts = products.filter(product => product.availableQuantity <= 10).length;
    const outOfStockProducts = products.filter(product => product.availableQuantity === 0).length;

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
    };
  };

  const stats = getStats();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
            <p className="text-gray-600 mt-1">
              Manage your product inventory with categories and suppliers
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            + Add Product
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📦</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💰</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">⚠️</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">❌</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <InventoryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          suppliers={suppliers}
          onClearFilters={handleClearFilters}
        />

        {/* Products List */}
        <InventoryList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          isLoading={isLoading}
        />

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(undefined);
          }}
          onSubmit={handleSubmitProduct}
          product={editingProduct}
          categories={categories}
          suppliers={suppliers}
          isLoading={isSubmitting}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete Product
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};