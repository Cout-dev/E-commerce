import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import api from '../../api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    rating: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products?sort=${sortBy}`);
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      rating: product.rating
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/products/${editingProduct}`, formData);
      if (response.data) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-[#3A6073] to-[#16222A]">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By:</label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="rating-asc">Lowest Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-6">
            {editingProduct === product._id ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-lg font-bold mb-2">${product.price}</p>
                <p className="text-gray-600 mb-2">Stock: {product.stock}</p>
                <p className="text-gray-600 mb-2">Rating: {product.rating}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement; 