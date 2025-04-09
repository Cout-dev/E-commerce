import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchProduct();
    }
  }, [user, navigate, id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        setError('Failed to fetch product');
      }
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put(`/products/${id}`, product);
      if (response.data.success) {
        navigate('/admin/products');
      } else {
        setError('Failed to update product');
      }
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3A6073] to-[#16222A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3A6073] to-[#16222A]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A6073] to-[#16222A]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16222A] focus:ring-[#16222A]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16222A] focus:ring-[#16222A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16222A] focus:ring-[#16222A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16222A] focus:ring-[#16222A]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16222A] focus:ring-[#16222A]"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={product.image}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16222A] focus:ring-[#16222A]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#16222A] text-white rounded-md hover:bg-[#16222A]/90 transition-all duration-300"
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct; 