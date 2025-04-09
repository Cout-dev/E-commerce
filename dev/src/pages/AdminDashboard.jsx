import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import ProductForm from '../components/admin/ProductForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await api.delete(`/products/${productId}`);
        if (response.data.success) {
          fetchProducts(); 
        } else {
          setError(response.data.message || 'Failed to delete product');
        }
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3A6073] to-[#16222A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A6073] to-[#16222A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/products')}
              className="bg-[#16222A] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-[#16222A]/90 transition-all duration-300"
            >
              View Products
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#16222A] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-[#16222A]/90 transition-all duration-300"
            >
              {showAddForm ? 'Hide Form' : 'Add New Product'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProductForm onSuccess={() => {
              setShowAddForm(false);
              fetchProducts();
            }} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                      className="text-[#16222A] hover:text-[#16222A]/80 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 