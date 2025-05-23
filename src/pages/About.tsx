// src/pages/About.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Inventory Management
            </Link>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Inventory Management System</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Our Inventory Management System is a comprehensive solution designed to streamline 
            your business operations with powerful features for product tracking, supplier management, 
            and user access control.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Complete product inventory management</li>
            <li>Category-based product organization</li>
            <li>Supplier information tracking</li>
            <li>Role-based access control (Admin/Manager)</li>
            <li>Real-time inventory updates</li>
            <li>Secure authentication system</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">User Roles</h2>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-lg mb-2">Administrator</h3>
            <p className="text-gray-600 mb-4">
              Full system access including user management, all inventory operations, 
              and system configuration.
            </p>
            
            <h3 className="font-semibold text-lg mb-2">Manager</h3>
            <p className="text-gray-600">
              Access to inventory management features including products, categories, 
              and suppliers. Cannot manage user accounts.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Frontend</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• React 19 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• React Router for navigation</li>
                <li>• Context API for state management</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Backend</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Spring Boot 3.2.5</li>
                <li>• Spring Security</li>
                <li>• PostgreSQL Database</li>
                <li>• RESTful API Architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// src/pages/NotFound.tsx
export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
            
            <div>
              <button
                onClick={() => window.history.back()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};