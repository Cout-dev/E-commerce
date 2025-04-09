import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await register(formData.email, formData.password);
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: '#16222A',
      background: '-webkit-linear-gradient(to right, #3A6073, #16222A)',
      background: 'linear-gradient(to right, #3A6073, #16222A)'
    }}>
      <div className="w-full max-w-[380px]">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="relative flex h-12">
            <div className="absolute inset-0 flex">
              <div className={`w-1/2 bg-[#16222A] transition-transform duration-300 transform ${
                isLoginPage ? 'translate-x-0' : 'translate-x-full'
              }`}></div>
            </div>
            <Link 
              to="/login"
              className={`relative w-1/2 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                isLoginPage ? 'text-white' : 'text-[#16222A]'
              }`}
            >
              Login
            </Link>
            <Link 
              to="/register"
              className={`relative w-1/2 flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                !isLoginPage ? 'text-white' : 'text-[#16222A]'
              }`}
            >
              Sign Up
            </Link>
          </div>

          <div className="p-8 pb-12" style={{ height: '420px' }}>
            <h2 className="text-2xl font-medium text-center text-[#16222A] mb-4">Create Account</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#16222A] text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#16222A] transition-all duration-300"
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#16222A] text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#16222A] transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-[#16222A] text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#16222A] transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#16222A] text-white py-3 rounded-lg font-medium shadow-lg hover:bg-[#16222A]/90 transition-all duration-300 mt-4"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 