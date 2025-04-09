import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-b from-[#3A6073] to-[#16222A] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-white hover:text-gray-200 transition-colors duration-300">
                E-Commerce
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-white text-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300"
              >
                Products
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin/products"
                  className="border-transparent text-white hover:text-gray-200 hover:border-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <button
                onClick={logout}
                className="bg-white text-[#16222A] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-[#16222A] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 