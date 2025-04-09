import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/products');
      } else {
        await register(email, password);
        navigate('/products');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-6 bg-white/10 p-1 rounded-full backdrop-blur-sm">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setIsLogin(true)}
            disabled={loading}
            className={`px-8 py-2 rounded-full font-semibold transition-all ${
              isLogin
                ? 'bg-white text-[#42275a]'
                : 'text-white hover:bg-white/10'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            disabled={loading}
            className={`px-8 py-2 rounded-full font-semibold transition-all ${
              !isLogin
                ? 'bg-white text-[#42275a]'
                : 'text-white hover:bg-white/10'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md h-[450px] flex flex-col">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42275a]"
                placeholder="Enter your username"
                disabled={loading}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42275a]"
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42275a]"
              placeholder="Enter your password"
              disabled={loading}
              required
              minLength={6}
            />
          </div>
          <div className="mt-auto pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white transition-all bg-[#42275a] ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{
                background: '#42275a',
                backgroundImage: '-webkit-linear-gradient(to top, #734b6d, #42275a)',
                backgroundImage: 'linear-gradient(to top, #734b6d, #42275a)'
              }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;