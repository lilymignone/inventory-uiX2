// src/pages/NotFound.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/');
    }
  };

  const suggestionLinks = [
    {
      title: 'Dashboard',
      description: 'Go to your main dashboard',
      link: '/dashboard',
      icon: '🏠',
      requireAuth: true,
    },
    {
      title: 'Products',
      description: 'Browse product inventory',
      link: '/products',
      icon: '📦',
      requireAuth: true,
    },
    {
      title: 'Home',
      description: 'Return to homepage',
      link: '/',
      icon: '🏡',
      requireAuth: false,
    },
    {
      title: 'Sign In',
      description: 'Access your account',
      link: '/auth',
      icon: '🔐',
      requireAuth: false,
    },
  ];

  const availableLinks = suggestionLinks.filter(link => 
    isAuthenticated ? link.requireAuth : !link.requireAuth
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Inventory Management
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/auth"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-8xl sm:text-9xl font-bold text-gray-200 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl animate-bounce">🔍</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 text-lg mb-2">
              The page you're looking for seems to have vanished into thin air.
            </p>
            <p className="text-gray-500 text-sm">
              Don't worry, it happens to the best of us!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              ← Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Where would you like to go?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.link}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-200">
                    {link.icon}
                  </span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 group-hover:text-blue-700">
                      {link.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {link.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Still need help? Here are some options:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                🔄 Refresh Page
              </button>
              <span className="hidden sm:inline text-gray-300">•</span>
              <Link
                to="/about"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                📖 Learn More
              </Link>
              <span className="hidden sm:inline text-gray-300">•</span>
              <button
                onClick={() => window.history.go(-2)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ⏮️ Go Back 2 Steps
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Inventory Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};