import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    if (user) {
      fetchCart();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch product');
      }
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', err);
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

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/cart/add', { 
        productId: id,
        quantity: quantity
      });
      if (response.data.success) {
        setCart([...cart, { product: id, quantity }]);
      } else {
        setError(response.data.message || 'Failed to add to cart');
      }
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const isInCart = () => {
    return cart.some(item => item.product === id);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
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
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#3A6073] to-[#16222A]">
        <div className="text-white">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A6073] to-[#16222A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-gray-600">({product.rating || 'No ratings yet'})</span>
              </div>
              <p className="text-2xl font-bold mb-4">${product.price}</p>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value)), product.stock))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16222A]"
                />
                <p className="text-sm text-gray-500 mt-1">Available: {product.stock}</p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isInCart()}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg ${
                  isInCart()
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-[#16222A] text-white hover:bg-[#16222A]/90 transition-all duration-300'
                }`}
              >
                <FaShoppingCart className="mr-2" />
                {isInCart() ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
