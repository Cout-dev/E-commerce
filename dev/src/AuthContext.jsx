import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get('/auth/verify');
      if (res.data && res.data.user) {
        const user = res.data.user;
        const updatedUser = {
          ...user,
          isAdmin: user.email === 'shubhankarrai007@gmail.com'
        };
        setUser(updatedUser);
        setError(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError('Your session has expired. Please log in again.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        setError(error.response?.data?.message || 'Token verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response format');
      }

      const { token, user } = res.data;
      
      const updatedUser = {
        ...user,
        isAdmin: email === 'shubhankarrai007@gmail.com'
      };
      
      setToken(token);
      setUser(updatedUser);
      localStorage.setItem('token', token);
      
      if (updatedUser.isAdmin) {
        window.location.href = '/admin/products';
      } else {
        window.location.href = '/products';
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw errorMessage;
    }
  };

  const register = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', { 
        email, 
        password 
      });
      
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response format');
      }

      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      
      window.location.href = '/';
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw errorMessage;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);