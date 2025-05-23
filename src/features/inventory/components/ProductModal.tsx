// src/features/inventory/components/ProductModal.tsx
import React, { useState, useEffect } from 'react';
import type { Product, ProductDto, Category, Supplier } from '../../../types/inventory';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductDto) => Promise<void>;
  product?: Product;
  categories: Category[];
  suppliers: Supplier[];
  isLoading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  suppliers,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProductDto>({
    name: '',
    description: '',
    availableQuantity: 0,
    unitPrice: 0,
    categoryId: '',
    supplierId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description || '',
        availableQuantity: product.availableQuantity,
        unitPrice: product.unitPrice,
        categoryId: product.category.id,
        supplierId: product.supplier.id,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        availableQuantity: 0,
        unitPrice: 0,
        categoryId: categories[0]?.id || '',
        supplierId: suppliers[0]?.id || '',
      });
    }
    setErrors({});
  }, [product, categories, suppliers, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'availableQuantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.availableQuantity < 0) {
      newErrors.availableQuantity = 'Quantity cannot be negative';
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Price must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {product ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Product Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter product name"
                        disabled={isLoading}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product description"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Quantity and Price Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="availableQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          id="availableQuantity"
                          name="availableQuantity"
                          value={formData.availableQuantity}
                          onChange={handleChange}
                          min="0"
                          step="1"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.availableQuantity ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={isLoading}
                        />
                        {errors.availableQuantity && <p className="mt-1 text-sm text-red-600">{errors.availableQuantity}</p>}
                      </div>

                      <div>
                        <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                          Unit Price ($) *
                        </label>
                        <input
                          type="number"
                          id="unitPrice"
                          name="unitPrice"
                          value={formData.unitPrice}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={isLoading}
                        />
                        {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.categoryId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                    </div>

                    {/* Supplier */}
                    <div>
                      <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier *
                      </label>
                      <select
                        id="supplierId"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.supplierId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        <option value="">Select a supplier</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                      {errors.supplierId && <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};