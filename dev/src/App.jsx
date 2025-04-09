import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './pages/ProductList';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminDashboard from './pages/AdminDashboard';
import EditProduct from './pages/EditProduct';
import Navbar from './components/layout/Navbar';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A6073] to-[#16222A]">
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminProductManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/new" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminProductManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products/:id/edit" 
          element={
            <ProtectedRoute requireAdmin>
              <EditProduct />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;