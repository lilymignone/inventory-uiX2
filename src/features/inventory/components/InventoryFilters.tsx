// src/features/inventory/components/InventoryFilters.tsx
import React, { useState } from 'react';
import type { ProductFilters, Category, Supplier } from '../../../types/inventory';

interface InventoryFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Category[];
  suppliers: Supplier[];
  onClearFilters: () => void;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  suppliers,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | undefined) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      (newFilters as any)[key] = value;
    }
    
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Search and Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            <svg 
              className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <select
                value={filters.supplierId || ''}
                onChange={(e) => handleFilterChange('supplierId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range ($)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || undefined)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || undefined)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Quantity Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minQuantity || ''}
                  onChange={(e) => handleFilterChange('minQuantity', parseInt(e.target.value) || undefined)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxQuantity || ''}
                  onChange={(e) => handleFilterChange('maxQuantity', parseInt(e.target.value) || undefined)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  
                  let displayValue = value.toString();
                  let displayKey = key;
                  
                  // Format display names and values
                  switch (key) {
                    case 'categoryId':
                      const category = categories.find(c => c.id === value);
                      displayKey = 'Category';
                      displayValue = category?.name || value.toString();
                      break;
                    case 'supplierId':
                      const supplier = suppliers.find(s => s.id === value);
                      displayKey = 'Supplier';
                      displayValue = supplier?.name || value.toString();
                      break;
                    case 'minPrice':
                      displayKey = 'Min Price';
                      displayValue = `$${value}`;
                      break;
                    case 'maxPrice':
                      displayKey = 'Max Price';
                      displayValue = `$${value}`;
                      break;
                    case 'minQuantity':
                      displayKey = 'Min Qty';
                      break;
                    case 'maxQuantity':
                      displayKey = 'Max Qty';
                      break;
                  }
                  
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {displayKey}: {displayValue}
                      <button
                        onClick={() => handleFilterChange(key as keyof ProductFilters, undefined)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};