import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { api } from '../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/products?page=${currentPage}&limit=12&search=${debouncedSearchTerm}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setProducts(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.data.message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, debouncedSearchTerm, category, sortBy, sortOrder]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await api.delete(`/products/${productId}`);
      
      if (response.data.success) {
        setProducts(products.filter(product => product._id !== productId));
      } else {
        setError(response.data.message || 'Failed to delete product');
      }
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/products', newProduct);
      if (response.data.success) {
        setShowAddForm(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          stock: '',
        });
        fetchProducts();
      }
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16222A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#16222A] mb-4 md:mb-0">
            {user?.role === 'admin' ? 'Manage Products' : 'Our Products'}
          </h1>
          
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-[#16222A]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-[#16222A]"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
              <option value="other">Other</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
              }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-[#16222A]"
            >
              <option value="createdAt-desc">Newest</option>
              <option value="createdAt-asc">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
            </select>
            {user?.role === 'admin' && (
              <div className="flex gap-4">
                <Link
                  to="/admin/dashboard"
                  className="bg-[#16222A] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-[#16222A]/90 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#16222A] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-[#16222A]/90 transition-all duration-300 flex items-center gap-2"
                >
                  <FaPlus /> Add New Product
                </button>
              </div>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full rounded-md border-gray-700 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleNewProductChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleNewProductChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                    type="text"
                    name="image"
                    value={newProduct.image}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#16222A] text-white rounded-md"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(products) && products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-56 p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
                {user?.role === 'admin' && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="bg-white/90 text-[#16222A] p-2 rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white transition-all duration-300 hover:scale-110"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#16222A] mb-2 line-clamp-1 hover:text-[#16222A]/80 transition-colors duration-300">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-12">{product.description}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#16222A] font-bold hover:text-[#16222A]/80 transition-colors duration-300">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 capitalize hover:text-gray-700 transition-colors duration-300">{product.category}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-[#16222A] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;