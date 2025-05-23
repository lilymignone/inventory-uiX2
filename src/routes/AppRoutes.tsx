// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Pages
import { AuthPage } from '../pages/AuthPage';
import { Dashboard } from '../pages/Dashboard';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { NotFound } from '../pages/NotFound';
import { CategoriesPage } from '../pages/CategoriesPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { UsersPage } from '../pages/UsersPage';
import { InventoryPage } from '../features/inventory/InventoryPage';

// Inventory features (to be created)

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Inventory management routes (Admin/Manager only) */}
      <Route
        path="/products"
        element={
          <ProtectedRoute requireAnyRole={['ADMIN', 'MANAGER']}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute requireAnyRole={['ADMIN', 'MANAGER']}>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/suppliers"
        element={
          <ProtectedRoute requireAnyRole={['ADMIN', 'MANAGER']}>
            <SuppliersPage />
          </ProtectedRoute>
        }
      />

      {/* User management routes (Admin only) */}
      <Route
        path="/users"
        element={
          <ProtectedRoute requireRoles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div className="p-4">Profile page (to be implemented)</div>
          </ProtectedRoute>
        }
      />

      {/* Redirect authenticated users from root to dashboard */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};