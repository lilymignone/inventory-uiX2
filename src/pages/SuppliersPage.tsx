import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { SupplierModal } from '../components/SupplierModal';
import { inventoryService } from '../services/inventoryService';
import type { Supplier } from '../types/inventory';
import toast from 'react-hot-toast';

export const SuppliersPage: React.FC = () => {
  // State
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Supplier | null>(null);

  // Load suppliers
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const loadingToast = toast.loading('Loading suppliers...');
    try {
      setIsLoading(true);
      const suppliersData = await inventoryService.getSuppliers();
      setSuppliers(suppliersData);
      toast.success('Suppliers loaded successfully', { id: loadingToast });
    } catch (err) {
      console.error('Error loading suppliers:', err);
      toast.error('Failed to load suppliers', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSupplier = () => {
    setEditingSupplier(undefined);
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setDeleteConfirm(supplier);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const deleteToast = toast.loading('Deleting supplier...');
    try {
      await inventoryService.deleteSupplier(deleteConfirm.id);
      await loadSuppliers();
      setDeleteConfirm(null);
      toast.success('Supplier deleted successfully', { id: deleteToast });
    } catch (err) {
      console.error('Error deleting supplier:', err);
      toast.error('Failed to delete supplier', { id: deleteToast });
    }
  };

  const handleSubmitSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    const actionType = editingSupplier ? 'Updating' : 'Creating';
    const toastId = toast.loading(`${actionType} supplier...`);

    try {
      if (editingSupplier) {
        await inventoryService.updateSupplier(editingSupplier.id, supplierData);
        toast.success('Supplier updated successfully', { id: toastId });
      } else {
        await inventoryService.createSupplier(supplierData);
        toast.success('Supplier created successfully', { id: toastId });
      }
      
      await loadSuppliers();
      setIsModalOpen(false);
      setEditingSupplier(undefined);
    } catch (err) {
      console.error('Error submitting supplier:', err);
      toast.error(`Failed to ${actionType.toLowerCase()} supplier`, { id: toastId });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-600 mt-1">
              Manage your inventory suppliers
            </p>
          </div>
          <button
            onClick={handleAddSupplier}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Supplier
          </button>
        </div>

        {/* Suppliers List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      {supplier.companyInfo && (
                        <div className="text-sm text-gray-500">{supplier.companyInfo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supplier.email}</div>
                      <div className="text-sm text-gray-500">{supplier.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{supplier.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(supplier.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditSupplier(supplier)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {suppliers.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>No suppliers found</p>
                        <button
                          onClick={handleAddSupplier}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add your first supplier
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
                <h3 className="text-lg font-medium text-gray-900">Delete Supplier</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete {deleteConfirm.name}? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supplier Modal */}
        <SupplierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitSupplier}
          supplier={editingSupplier}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
}; 