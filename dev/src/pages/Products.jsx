import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

const Products = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchCart();
    }
  }, [user]);

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

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        setCart(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/cart/add', { productId });
      if (response.data.success) {
        setCart([...cart, { product: productId }]);
      } else {
        setError(response.data.message || 'Failed to add to cart');
      }
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const isInCart = (productId) => {
    return cart.some(item => item.product === productId);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy === 'rating') {
      return sortOrder === 'asc' ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: '#42275a',
        background: '-webkit-linear-gradient(to right, #734b6d, #42275a)',
        background: 'linear-gradient(to right, #734b6d, #42275a)'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: '#42275a',
      background: '-webkit-linear-gradient(to right, #734b6d, #42275a)',
      background: 'linear-gradient(to right, #734b6d, #42275a)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Our Products</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42275a]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42275a]"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Kitchen</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42275a]"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 rounded-lg bg-[#42275a] text-white hover:bg-[#42275a]/90 transition-all duration-300"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-gray-600">{product.rating || 'No ratings yet'}</span>
                </div>
                <p className="text-lg font-bold mb-4">${product.price}</p>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={isInCart(product._id)}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg ${
                    isInCart(product._id)
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-[#42275a] text-white hover:bg-[#42275a]/90 transition-all duration-300'
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  {isInCart(product._id) ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products; 