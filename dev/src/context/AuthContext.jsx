import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('http://localhost:5000/api/auth/verify');
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password
      });
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);