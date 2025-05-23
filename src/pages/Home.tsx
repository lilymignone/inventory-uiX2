// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Inventory Management
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                About
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your
            <span className="text-blue-600 block">Inventory Management</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive solution for managing products, categories, suppliers, and users 
            with role-based access control and real-time tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/about"
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Product Management
            </h3>
            <p className="text-gray-600">
              Efficiently manage your product inventory with detailed tracking and categorization.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Role-Based Access
            </h3>
            <p className="text-gray-600">
              Secure access control with Admin and Manager roles to protect sensitive operations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-time Tracking
            </h3>
            <p className="text-gray-600">
              Monitor inventory levels, supplier information, and system activity in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};