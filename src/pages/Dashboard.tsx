// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { inventoryService } from '../services/inventoryService';
import type{ Product, Category, Supplier } from '../types/inventory';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  recentProducts: Product[];
}

export const Dashboard: React.FC = () => {
  const { user, hasAnyRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    totalValue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    recentProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canAccessInventory = hasAnyRole(['ADMIN', 'MANAGER']);
  const canAccessUsers = hasAnyRole(['ADMIN']);

  useEffect(() => {
    if (canAccessInventory) {
      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [canAccessInventory]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [products, categories, suppliers] = await Promise.all([
        inventoryService.getProducts(),
        inventoryService.getCategories(),
        inventoryService.getSuppliers(),
      ]);

      const totalValue = products.reduce(
        (sum, product) => sum + (product.unitPrice * product.availableQuantity),
        0
      );

      const lowStockProducts = products.filter(product => 
        product.availableQuantity > 0 && product.availableQuantity <= 10
      ).length;

      const outOfStockProducts = products.filter(product => 
        product.availableQuantity === 0
      ).length;

      // Get 5 most recent products
      const recentProducts = products
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalSuppliers: suppliers.length,
        totalValue,
        lowStockProducts,
        outOfStockProducts,
        recentProducts,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Products',
      description: 'Manage your product inventory',
      link: '/products',
      icon: '📦',
      color: 'bg-blue-500 hover:bg-blue-600',
      available: canAccessInventory,
    },
    {
      title: 'Categories',
      description: 'Organize products by categories',
      link: '/categories',
      icon: '🏷️',
      color: 'bg-green-500 hover:bg-green-600',
      available: canAccessInventory,
    },
    {
      title: 'Suppliers',
      description: 'Manage supplier information',
      link: '/suppliers',
      icon: '🚚',
      color: 'bg-purple-500 hover:bg-purple-600',
      available: canAccessInventory,
    },
    {
      title: 'Users',
      description: 'Manage user accounts and roles',
      link: '/users',
      icon: '👥',
      color: 'bg-orange-500 hover:bg-orange-600',
      available: canAccessUsers,
    },
  ];

  const availableActions = quickActions.filter(action => action.available);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {getGreeting()}, {user?.fullName}! 👋
              </h1>
              <p className="text-blue-100 mb-1">
                Role: <span className="font-medium text-white">{user?.role.name}</span>
              </p>
              <p className="text-blue-100 text-sm">
                Welcome to your inventory management dashboard
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl opacity-20">📊</div>
            </div>
          </div>
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
              <div className="ml-3 flex-1">
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

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className={`${action.color} text-white rounded-lg shadow hover:shadow-md transition-all duration-200 p-6 block group transform hover:scale-105`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {action.title}
                </h3>
                <p className="text-sm opacity-90">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        {canAccessInventory && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Inventory Overview</h2>
              {!isLoading && (
                <button
                  onClick={loadDashboardData}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">📦</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">💰</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalValue)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">⚠️</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">❌</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Stats */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Categories & Suppliers</h3>
                    <div className="text-2xl">📊</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Categories</span>
                      <span className="font-medium text-blue-600">{stats.totalCategories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Suppliers</span>
                      <span className="font-medium text-purple-600">{stats.totalSuppliers}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
                    <div className="text-2xl">🚨</div>
                  </div>
                  <div className="space-y-3">
                    {stats.lowStockProducts > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? 's' : ''} running low
                        </span>
                      </div>
                    )}
                    {stats.outOfStockProducts > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {stats.outOfStockProducts} product{stats.outOfStockProducts !== 1 ? 's' : ''} out of stock
                        </span>
                      </div>
                    )}
                    {stats.lowStockProducts === 0 && stats.outOfStockProducts === 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">All products in stock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity */}
        {canAccessInventory && !isLoading && stats.recentProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recently Updated Products</h2>
                <Link
                  to="/products"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {product.category.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Qty: {product.availableQuantity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatCurrency(product.unitPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {formatDate(product.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message for Non-Inventory Users */}
        {!canAccessInventory && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to the Inventory System!
            </h2>
            <p className="text-gray-600 mb-4">
              Your account is set up and ready. Contact your administrator for access to inventory features.
            </p>
            <div className="text-sm text-gray-500">
              Current Role: <span className="font-medium text-blue-600">{user?.role.name}</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};