// src/features/inventory/InventoryPage.tsx
import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { InventoryList } from './InventoryList';
import { InventoryFilters } from './components/InventoryFilters';
import { ProductModal } from './components/ProductModal';
import { inventoryService } from '../../services/inventoryService';
import type { Product, ProductDto, ProductFilters, Category, Supplier } from '../../types/inventory';
import toast from 'react-hot-toast';

export const InventoryPage: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
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
    const loadingToast = toast.loading('Loading inventory data...');
    try {
      setIsLoading(true);
      const productsData = await inventoryService.getProducts({});
      setProducts(productsData);
      setFilteredProducts(productsData);
      setError(null);
      toast.success('Data loaded successfully', { id: loadingToast });
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products', { id: loadingToast });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
    toast.success('Add product form opened');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    toast.success(`Editing product: ${product.name}`);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteConfirm(product);
    toast(`Please confirm deletion of ${product.name}`);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const deleteToast = toast.loading('Deleting product...');
    try {
      await inventoryService.deleteProduct(deleteConfirm.id);
      await loadProducts();
      setDeleteConfirm(null);
      toast.success(`${deleteConfirm.name} deleted successfully`, { id: deleteToast });
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
      toast.error('Failed to delete product', { id: deleteToast });
    }
  };

  const handleSubmitProduct = async (productData: ProductDto) => {
    setIsSubmitting(true);
    const actionType = editingProduct ? 'Updating' : 'Creating';
    const toastId = toast.loading(`${actionType} product...`);

    try {
      if (editingProduct) {
        await inventoryService.updateProduct(editingProduct.id, productData);
        toast.success(`Product "${productData.name}" updated successfully`, { id: toastId });
      } else {
        await inventoryService.createProduct(productData);
        toast.success(`Product "${productData.name}" created successfully`, { id: toastId });
      }
      
      await loadProducts();
      setIsModalOpen(false);
      setEditingProduct(undefined);
    } catch (err) {
      console.error('Error submitting product:', err);
      toast.error(`Failed to ${actionType.toLowerCase()} product`, { id: toastId });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    // Remove any undefined or empty string values
    const cleanedFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key as keyof ProductFilters] = value;
      }
      return acc;
    }, {} as ProductFilters);
    
    setFilters(cleanedFilters);
    toast.success('Filters applied');

    // Apply filters to the products array
    let filtered = [...products];

    if (cleanedFilters.search) {
      const searchTerm = cleanedFilters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (cleanedFilters.categoryId) {
      filtered = filtered.filter(product => 
        product.category.id === Number(cleanedFilters.categoryId)
      );
    }

    if (cleanedFilters.supplierId) {
      filtered = filtered.filter(product => 
        product.supplier.id === Number(cleanedFilters.supplierId)
      );
    }

    if (cleanedFilters.minPrice) {
      filtered = filtered.filter(product => 
        product.unitPrice >= Number(cleanedFilters.minPrice)
      );
    }

    if (cleanedFilters.maxPrice) {
      filtered = filtered.filter(product => 
        product.unitPrice <= Number(cleanedFilters.maxPrice)
      );
    }

    if (cleanedFilters.minQuantity) {
      filtered = filtered.filter(product => 
        product.availableQuantity >= Number(cleanedFilters.minQuantity)
      );
    }

    if (cleanedFilters.maxQuantity) {
      filtered = filtered.filter(product => 
        product.availableQuantity <= Number(cleanedFilters.maxQuantity)
      );
    }

    setFilteredProducts(filtered);
    toast.success(`Found ${filtered.length} products matching filters`);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilteredProducts(products);
    toast.success('All filters cleared');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStats = () => {
    // Ensure products is an array
    if (!Array.isArray(products)) {
      return {
        totalProducts: 0,
        totalValue: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
      };
    }

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Product
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'RWF',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stats.totalValue)}
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

        <InventoryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          suppliers={suppliers}
          onClearFilters={handleClearFilters}
        />

        <InventoryList
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          isLoading={isLoading}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Product</h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};